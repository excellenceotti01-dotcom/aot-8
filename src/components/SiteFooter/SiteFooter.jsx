import { aot8Settings, siteNavigation } from '../../data'
import './SiteFooter.css'

function footerLinks() {
  return [
    ...siteNavigation.primary.map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href ?? item.items?.[0]?.href,
    })),
    { id: 'register', label: siteNavigation.registration.label, href: siteNavigation.registration.href },
  ]
}

export function SiteFooter() {
  const year = new Date(aot8Settings.dates.start).getFullYear()
  const links = footerLinks()

  return (
    <footer className="site-footer" aria-label="AOT 8.0 footer">
      <div className="site-footer__content">
        <p className="site-footer__identity">{aot8Settings.shortName}</p>
        <nav className="site-footer__nav" aria-label="Footer navigation">
          {links.map((link) => <a href={link.href} key={link.id}>{link.label}</a>)}
        </nav>
      </div>
      <p className="site-footer__legal">© {year} {aot8Settings.shortName}</p>
    </footer>
  )
}
