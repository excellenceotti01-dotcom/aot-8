import { HomePage } from './pages/HomePage'
import { RegistrationPage } from './pages/RegistrationPage'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '')

  return pathname === '/aot-8/register' ? <RegistrationPage /> : <HomePage />
}

export default App
