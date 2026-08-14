import { useContext } from 'react'
import { Aot8SettingsContext } from './aot8SettingsContext'

export function useAot8Settings() {
  return useContext(Aot8SettingsContext)
}
