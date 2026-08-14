import {
  aot8Settings,
  heroPropositions,
  registrationSettings,
  sessions,
  speakers,
  sponsors,
} from '../data'

const SETTINGS_ENDPOINT = 'https://aotlagos.com/wp-json/aot8/v1/settings'
const SPEAKERS_ENDPOINT = 'https://aotlagos.com/wp-json/aot8/v1/speakers'
const SESSIONS_ENDPOINT = 'https://aotlagos.com/wp-json/aot8/v1/sessions'
const SPONSORS_ENDPOINT = 'https://aotlagos.com/wp-json/aot8/v1/sponsors'
const REGISTRATION_SETTINGS_ENDPOINT = 'https://aotlagos.com/wp-json/aot8/v1/registration/settings'
const HERO_STATES_ENDPOINT = 'https://aotlagos.com/wp-json/aot8/v1/hero-states'

const valueOrFallback = (value, fallback) => (typeof value === 'string' && value.trim() ? value.trim() : fallback)

export function normalizeAot8Settings(response = {}) {
  const eventName = valueOrFallback(response.event_name, aot8Settings.eventName)
  const edition = valueOrFallback(response.edition, aot8Settings.edition)
  const eventDate = valueOrFallback(response.event_date, aot8Settings.dates.start)

  return {
    ...aot8Settings,
    eventName,
    edition,
    theme: valueOrFallback(response.theme, aot8Settings.theme ?? null),
    brand: { ...aot8Settings.brand, identityEdition: edition },
    dates: { ...aot8Settings.dates, start: eventDate, end: eventDate },
    venue: {
      city: valueOrFallback(response.location, aot8Settings.venue.city),
      name: valueOrFallback(response.venue, aot8Settings.venue.name),
    },
    hero: {
      heading: valueOrFallback(response.hero_heading, null),
      subheading: valueOrFallback(response.hero_subheading, null),
      imageId: valueOrFallback(response.hero_image_id, null),
      ctaText: valueOrFallback(response.hero_cta_text, null),
      ctaUrl: valueOrFallback(response.hero_cta_url, null),
    },
    footer: {
      description: valueOrFallback(response.footer_description, null),
      copyrightText: valueOrFallback(response.copyright_text, null),
    },
  }
}

async function getSettings() {
  const response = await fetch(SETTINGS_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`AOT 8.0 settings request failed with ${response.status}.`)
  return normalizeAot8Settings(await response.json())
}

function speakerImageSource(speaker) {
  if (typeof speaker.image === 'string') return speaker.image
  if (speaker.image && typeof speaker.image === 'object') return speaker.image.src ?? speaker.image.url ?? speaker.image.source_url ?? null
  return speaker.image_url ?? speaker.featured_image_url ?? null
}

export function normalizeAot8Speakers(response) {
  if (!Array.isArray(response)) return speakers

  const normalizedSpeakers = response.map((speaker) => {
    const id = String(speaker.id ?? speaker.slug ?? '')
    const name = typeof speaker.name === 'string' ? speaker.name.trim() : typeof speaker.title === 'string' ? speaker.title.trim() : ''
    const imageSource = speakerImageSource(speaker)
    if (!id || !name || !imageSource) return null

    return {
      id,
      name,
      image: {
        src: imageSource,
        alt: speaker.image?.alt ?? speaker.image_alt ?? name,
      },
      linkedinUrl: speaker.linkedin_url ?? speaker.linkedinUrl ?? null,
    }
  }).filter(Boolean)

  if (normalizedSpeakers.length === 0) return speakers

  return {
    data: normalizedSpeakers,
    meta: { source: 'wordpress', total: normalizedSpeakers.length },
  }
}

async function getSpeakers() {
  const response = await fetch(SPEAKERS_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`AOT 8.0 speakers request failed with ${response.status}.`)
  return normalizeAot8Speakers(await response.json())
}

function sessionSpeakerIds(value) {
  if (!Array.isArray(value)) return []
  return value.map((speaker) => String(typeof speaker === 'object' ? speaker.id ?? speaker.slug ?? '' : speaker)).filter(Boolean)
}

export function normalizeAot8Sessions(response) {
  if (!Array.isArray(response)) return sessions

  const normalizedSessions = response.map((session, index) => {
    const id = String(session.id ?? session.slug ?? '')
    const title = typeof session.title === 'string' ? session.title.trim() : typeof session.name === 'string' ? session.name.trim() : ''
    if (!id || !title) return null

    return {
      id,
      title,
      description: typeof session.description === 'string' ? session.description : '',
      date: typeof session.date === 'string' ? session.date : '',
      startTime: typeof session.start_time === 'string' ? session.start_time : typeof session.startTime === 'string' ? session.startTime : '',
      endTime: typeof session.end_time === 'string' ? session.end_time : typeof session.endTime === 'string' ? session.endTime : '',
      venue: typeof session.venue === 'string' ? session.venue : '',
      room: typeof session.room === 'string' ? session.room : '',
      sessionType: typeof session.session_type === 'string' ? session.session_type : typeof session.sessionType === 'string' ? session.sessionType : '',
      speakers: sessionSpeakerIds(session.speakers ?? session.speaker_ids),
      featured: Boolean(session.featured),
      displayOrder: Number(session.display_order ?? session.displayOrder ?? session.menu_order ?? index + 1),
    }
  }).filter(Boolean)

  if (normalizedSessions.length === 0) return sessions

  return {
    data: normalizedSessions,
    meta: { ...sessions.meta, source: 'wordpress', total: normalizedSessions.length },
  }
}

async function getSessions() {
  const response = await fetch(SESSIONS_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`AOT 8.0 sessions request failed with ${response.status}.`)
  return normalizeAot8Sessions(await response.json())
}

function sponsorLogoSource(sponsor) {
  if (typeof sponsor.logo === 'string') return sponsor.logo
  if (sponsor.logo && typeof sponsor.logo === 'object') return sponsor.logo.src ?? sponsor.logo.url ?? sponsor.logo.source_url ?? null
  return sponsor.logo_url ?? sponsor.image_url ?? sponsor.featured_image_url ?? null
}

function sponsorCategory(value) {
  const normalizedValue = typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, '-') : ''
  const matchingCategory = sponsors.meta.categories.find((category) => category.id === normalizedValue || category.label.toLowerCase() === normalizedValue.replace(/-/g, ' '))
  return matchingCategory?.id ?? 'sponsors'
}

export function normalizeAot8Sponsors(response) {
  if (!Array.isArray(response)) return sponsors

  const normalizedSponsors = response.map((sponsor) => {
    const id = String(sponsor.id ?? sponsor.slug ?? '')
    const name = typeof sponsor.name === 'string' ? sponsor.name.trim() : typeof sponsor.title === 'string' ? sponsor.title.trim() : ''
    const logoSource = sponsorLogoSource(sponsor)
    if (!id || !name || !logoSource) return null

    return {
      id,
      name,
      logo: { src: logoSource, alt: sponsor.logo?.alt ?? sponsor.logo_alt ?? name },
      category: sponsorCategory(sponsor.category ?? sponsor.sponsor_type ?? sponsor.type),
      destinationUrl: sponsor.destination_url ?? sponsor.website_url ?? sponsor.url ?? null,
      isSampleData: false,
    }
  }).filter(Boolean)

  if (normalizedSponsors.length === 0) return sponsors

  return {
    data: normalizedSponsors,
    meta: { ...sponsors.meta, source: 'wordpress', total: normalizedSponsors.length },
  }
}

async function getSponsors() {
  const response = await fetch(SPONSORS_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`AOT 8.0 sponsors request failed with ${response.status}.`)
  return normalizeAot8Sponsors(await response.json())
}

export function normalizeAot8RegistrationSettings(response) {
  if (!response || typeof response !== 'object' || Array.isArray(response)) return registrationSettings

  const hasOpenValue = typeof response.open === 'boolean'
  const hasDeadlineValue = typeof response.deadline === 'string' && response.deadline.trim()
  const hasRolesValue = response.roles && typeof response.roles === 'object' && !Array.isArray(response.roles)
  if (!hasOpenValue && !hasDeadlineValue && !hasRolesValue) return registrationSettings

  const enabledTypes = hasRolesValue
    ? registrationSettings.data.types.filter((type) => response.roles[type.id] !== false)
    : registrationSettings.data.types

  return {
    data: {
      ...registrationSettings.data,
      isOpen: hasOpenValue ? response.open : registrationSettings.data.isOpen,
      closesAt: hasDeadlineValue ? response.deadline.trim() : registrationSettings.data.closesAt,
      types: enabledTypes,
    },
    meta: { ...registrationSettings.meta, source: 'wordpress' },
  }
}

async function getRegistrationSettings() {
  const response = await fetch(REGISTRATION_SETTINGS_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`AOT 8.0 registration settings request failed with ${response.status}.`)
  return normalizeAot8RegistrationSettings(await response.json())
}

const heroStateKeys = new Set(heroPropositions.map((proposition) => proposition.id))

export function normalizeAot8HeroStates(response) {
  const cmsStates = response
  if (!Array.isArray(cmsStates) || cmsStates.length === 0 || cmsStates.length !== heroPropositions.length) {
    return { data: heroPropositions, meta: { source: 'mock', total: heroPropositions.length } }
  }

  const statesByKey = new Map()
  for (const state of cmsStates) {
    if (!state || typeof state !== 'object' || !heroStateKeys.has(state.state_key) || typeof state.enabled !== 'boolean' || !Number.isFinite(Number(state.display_order)) || statesByKey.has(state.state_key)) {
      return { data: heroPropositions, meta: { source: 'mock', total: heroPropositions.length } }
    }
    statesByKey.set(state.state_key, state)
  }

  if (statesByKey.size !== heroPropositions.length) return { data: heroPropositions, meta: { source: 'mock', total: heroPropositions.length } }

  const normalizedStates = heroPropositions.flatMap((proposition) => {
    const state = statesByKey.get(proposition.id)
    if (!state.enabled) return []

    return [{
      ...proposition,
      eyebrow: valueOrFallback(state.eyebrow, proposition.eyebrow),
      headline: valueOrFallback(state.heading, proposition.headline),
      description: valueOrFallback(state.description, proposition.description),
      cta: {
        label: valueOrFallback(state.cta_label, proposition.cta.label),
        href: valueOrFallback(state.cta_url, proposition.cta.href),
      },
      displayOrder: Number(state.display_order),
    }]
  }).sort((first, second) => first.displayOrder - second.displayOrder)

  if (normalizedStates.length === 0) return { data: heroPropositions, meta: { source: 'mock', total: heroPropositions.length } }

  return {
    data: normalizedStates,
    meta: { source: 'wordpress', total: normalizedStates.length },
  }
}

async function getHeroStates() {
  const response = await fetch(HERO_STATES_ENDPOINT, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`AOT 8.0 Hero States request failed with ${response.status}.`)
  return normalizeAot8HeroStates(await response.json())
}

// The UI should use this boundary instead of importing a CMS endpoint directly.
export const aot8DataClient = {
  getSettings,
  getSpeakers,
  getSessions,
  getSponsors,
  getRegistrationSettings,
  getHeroStates,
}
