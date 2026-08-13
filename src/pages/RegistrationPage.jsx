import { RegistrationExperience } from '../components/Registration/RegistrationExperience'
import { SiteFooter } from '../components/SiteFooter/SiteFooter'
import { SiteNavbar } from '../components/SiteNavbar/SiteNavbar'
import './RegistrationPage.css'

export function RegistrationPage() {
  return (
    <div className="registration-page">
      <SiteNavbar />
      <main className="registration-page__main">
        <RegistrationExperience />
      </main>
      <SiteFooter />
    </div>
  )
}
