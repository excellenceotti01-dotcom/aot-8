import { siteNavigation } from '../../data'
import { useAot8Settings } from '../../lib/useAot8Settings'

export function SiteNavbar() {
  const { settings: aot8Settings } = useAot8Settings()

  return (
    <nav className="network-prototype__nav" aria-label="Primary navigation">
      <a className="network-prototype__nav-mark" href="#home">{aot8Settings.shortName}</a>
      <div className="network-prototype__nav-right">
        <div className="network-prototype__nav-links">
          {siteNavigation.primary.map((item) => item.items ? (
            <details
              className={'network-prototype__nav-menu'}
              key={item.id}
              onMouseEnter={(event) => {
                const menu = event.currentTarget
                menu.parentElement.querySelectorAll('.network-prototype__nav-menu').forEach((sibling) => {
                  sibling.open = sibling === menu
                })
              }}
              onMouseLeave={(event) => {
                event.currentTarget.open = false
              }}
              onClick={(event) => {
                if (event.target.closest('summary')) event.preventDefault()
              }}
            >
              <summary>{item.label} <span aria-hidden="true">▼</span></summary>
              <div>{item.items.map((child) => <a href={child.href} key={child.id}>{child.label}</a>)}</div>
            </details>
          ) : <a href={item.href} key={item.id}>{item.label}</a>)}
        </div>
        <a className="network-prototype__nav-register" href={siteNavigation.registration.href}>{siteNavigation.registration.label}</a>
      </div>
    </nav>
  )
}
