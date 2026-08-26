import { REGISTRATION_PATH } from '../constants/routes'

// Prototype-only mock content. A future content source can provide the same fields.
export const heroPropositions = [
  {
    id: 'attend',
    networkForm: 'africa',
    eyebrow: 'A living exchange',
    headline: 'Experience AOT 8.0',
    description:
      'Join the people shaping the next chapter of technology, business and innovation in Lagos.',
    cta: { label: 'Register to attend', href: REGISTRATION_PATH },
  },
  {
    id: 'speak',
    networkForm: 'soundWave',
    eyebrow: 'A living exchange',
    headline: 'Have something to say?',
    description:
      'Bring your ideas, expertise and perspective to the conversations shaping the future.',
    cta: { label: 'Become a speaker', href: 'https://aotlagos.com/' },
  },
  {
    id: 'sponsor',
    networkForm: 'technology',
    eyebrow: 'A living exchange',
    headline: 'Shape the ecosystem',
    description:
      'Connect your organization with the people, ideas and opportunities driving technological growth.',
    cta: { label: 'Become a sponsor', href: 'https://aotlagos.com/' },
  },
  {
    id: 'exhibit',
    networkForm: 'innovation',
    eyebrow: 'A living exchange',
    headline: 'Put your technology in the room',
    description:
      'Showcase your products, ideas and solutions to an audience actively building what’s next.',
    cta: { label: 'Become an exhibitor', href: 'https://aotlagos.com/' },
  },
  {
    id: 'explore',
    networkForm: 'governance',
    eyebrow: 'A living exchange',
    headline: 'See what came before',
    description:
      'Explore previous editions, stories, conversations and moments from AOT Lagos.',
    cta: { label: 'Explore past editions', href: 'https://aotlagos.com/' },
  },
  {
    id: 'media',
    networkForm: 'ethics',
    eyebrow: 'A living exchange',
    headline: 'Watch. Listen. Discover.',
    description:
      'Explore the ideas, people and moments captured across AOT Lagos.',
    cta: { label: 'View media', href: 'https://aotlagos.com/' },
  },
]
