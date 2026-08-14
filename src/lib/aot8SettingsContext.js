import { createContext } from 'react'
import { aot8Settings, heroPropositions, registrationSettings, sessions, speakers, sponsors } from '../data'

export const Aot8SettingsContext = createContext({
  settings: aot8Settings,
  status: 'loading',
  error: null,
  speakers,
  speakersStatus: 'loading',
  speakersError: null,
  sessions,
  sessionsStatus: 'loading',
  sessionsError: null,
  sponsors,
  sponsorsStatus: 'loading',
  sponsorsError: null,
  registrationSettings,
  registrationSettingsStatus: 'loading',
  registrationSettingsError: null,
  heroStates: { data: heroPropositions, meta: { source: 'mock', total: heroPropositions.length } },
  heroStatesStatus: 'loading',
  heroStatesError: null,
})
