import { HomePage } from './pages/HomePage'
import { RegistrationPage } from './pages/RegistrationPage'
import { Aot8SettingsProvider } from './lib/Aot8SettingsProvider'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '')

  return <Aot8SettingsProvider>{pathname === '/aot-8/register' ? <RegistrationPage /> : <HomePage />}</Aot8SettingsProvider>
}

export default App
