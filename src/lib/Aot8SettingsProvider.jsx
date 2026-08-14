import { useEffect, useMemo, useState } from 'react'
import { aot8Settings, registrationSettings as mockRegistrationSettings, sessions as mockSessions, speakers as mockSpeakers, sponsors as mockSponsors } from '../data'
import { aot8DataClient } from './aot8DataClient'
import { Aot8SettingsContext } from './aot8SettingsContext'

export function Aot8SettingsProvider({ children }) {
  const [settings, setSettings] = useState(aot8Settings)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [speakers, setSpeakers] = useState(mockSpeakers)
  const [speakersStatus, setSpeakersStatus] = useState('loading')
  const [speakersError, setSpeakersError] = useState(null)
  const [sessions, setSessions] = useState(mockSessions)
  const [sessionsStatus, setSessionsStatus] = useState('loading')
  const [sessionsError, setSessionsError] = useState(null)
  const [sponsors, setSponsors] = useState(mockSponsors)
  const [sponsorsStatus, setSponsorsStatus] = useState('loading')
  const [sponsorsError, setSponsorsError] = useState(null)
  const [registrationSettings, setRegistrationSettings] = useState(mockRegistrationSettings)
  const [registrationSettingsStatus, setRegistrationSettingsStatus] = useState('loading')
  const [registrationSettingsError, setRegistrationSettingsError] = useState(null)

  useEffect(() => {
    let isCurrent = true

    aot8DataClient.getSettings()
      .then((nextSettings) => {
        if (!isCurrent) return
        setSettings(nextSettings)
        setStatus('ready')
      })
      .catch((nextError) => {
        if (!isCurrent) return
        setError(nextError)
        setStatus('error')
      })

    aot8DataClient.getSpeakers()
      .then((nextSpeakers) => {
        if (!isCurrent) return
        setSpeakers(nextSpeakers)
        setSpeakersStatus('ready')
      })
      .catch((nextError) => {
        if (!isCurrent) return
        setSpeakersError(nextError)
        setSpeakersStatus('error')
      })

    aot8DataClient.getSessions()
      .then((nextSessions) => {
        if (!isCurrent) return
        setSessions(nextSessions)
        setSessionsStatus('ready')
      })
      .catch((nextError) => {
        if (!isCurrent) return
        setSessionsError(nextError)
        setSessionsStatus('error')
      })

    aot8DataClient.getSponsors()
      .then((nextSponsors) => {
        if (!isCurrent) return
        setSponsors(nextSponsors)
        setSponsorsStatus('ready')
      })
      .catch((nextError) => {
        if (!isCurrent) return
        setSponsorsError(nextError)
        setSponsorsStatus('error')
      })

    aot8DataClient.getRegistrationSettings()
      .then((nextRegistrationSettings) => {
        if (!isCurrent) return
        setRegistrationSettings(nextRegistrationSettings)
        setRegistrationSettingsStatus('ready')
      })
      .catch((nextError) => {
        if (!isCurrent) return
        setRegistrationSettingsError(nextError)
        setRegistrationSettingsStatus('error')
      })

    return () => { isCurrent = false }
  }, [])

  const value = useMemo(() => ({ settings, status, error, speakers, speakersStatus, speakersError, sessions, sessionsStatus, sessionsError, sponsors, sponsorsStatus, sponsorsError, registrationSettings, registrationSettingsStatus, registrationSettingsError }), [settings, status, error, speakers, speakersStatus, speakersError, sessions, sessionsStatus, sessionsError, sponsors, sponsorsStatus, sponsorsError, registrationSettings, registrationSettingsStatus, registrationSettingsError])

  return <Aot8SettingsContext.Provider value={value}>{children}</Aot8SettingsContext.Provider>
}
