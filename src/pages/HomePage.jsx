import { AboutAot8 } from '../components/AboutAot8/AboutAot8'
import { EventSection } from '../components/EventSection/EventSection'
import { EcosystemSection } from '../components/EcosystemSection/EcosystemSection'
import { HomeHero } from '../components/HomeHero/HomeHero'
import { PeopleBehindAot8 } from '../components/PeopleBehindAot8/PeopleBehindAot8'
import { ProgrammeSection } from '../components/ProgrammeSection/ProgrammeSection'
import { SiteNavbar } from '../components/SiteNavbar/SiteNavbar'
import { SiteFooter } from '../components/SiteFooter/SiteFooter'
import { useEffect } from 'react'

export function HomePage() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SiteNavbar />
      <HomeHero showNavbar={false} />
      <AboutAot8 />
      <EventSection />
      <PeopleBehindAot8 />
      <ProgrammeSection />
      <EcosystemSection />
      <SiteFooter />
    </>
  )
}
