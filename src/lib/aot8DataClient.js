import {
  aot8Settings,
  registrationSettings,
  sessions,
  speakers,
  sponsors,
} from '../data'

// The UI should use this boundary instead of importing a future CMS directly.
// Its mock implementations can later be replaced with API-backed equivalents.
export const aot8DataClient = {
  getSettings: () => Promise.resolve(aot8Settings),
  getSpeakers: () => Promise.resolve(speakers),
  getSessions: () => Promise.resolve(sessions),
  getSponsors: () => Promise.resolve(sponsors),
  getRegistrationSettings: () => Promise.resolve(registrationSettings),
}
