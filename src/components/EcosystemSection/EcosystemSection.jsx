import { useEffect, useMemo, useRef, useState } from 'react'
import { useAot8Settings } from '../../lib/useAot8Settings'
import { HoverBrandLogo } from '../ui/HoverBrandLogo'
import './EcosystemSection.css'

export function EcosystemSection() {
  const { sponsors } = useAot8Settings()
  const sectionRef = useRef(null)
  const [isEntered, setIsEntered] = useState(false)
  const [activeCategory, setActiveCategory] = useState('partners')
  const categories = sponsors.meta.categories
  const maxCategorySize = useMemo(
    () => Math.max(0, ...categories.map((category) => sponsors.data.filter((organisation) => organisation.category === category.id).length)),
    [categories, sponsors.data],
  )
  const organisations = useMemo(
    () => sponsors.data.filter((organisation) => organisation.category === activeCategory),
    [activeCategory, sponsors.data],
  )
  const activeCategoryLabel = categories.find((category) => category.id === activeCategory)?.label

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) {
      setIsEntered(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.36 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="ecosystem-section-track">
    <section ref={sectionRef} className={`ecosystem-section${isEntered ? ' ecosystem-section--entered' : ''}`} aria-labelledby="ecosystem-title">
      <div className="ecosystem-section__content">
        <header className="ecosystem-section__intro">
          <h2 id="ecosystem-title">
            {sponsors.meta.section.heading.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <nav className="ecosystem-section__categories" aria-label="Organisation categories">
            {categories.map((category) => <button type="button" className={activeCategory === category.id ? 'is-active' : ''} key={category.id} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </nav>
        </header>
        <HoverBrandLogo key={activeCategory} brands={organisations} minimumItems={maxCategorySize} label={sponsors.meta.section.logoCollectionLabel} contextLabel={`${activeCategoryLabel} with`} defaultText="AOT 8.0" />
      </div>
    </section>
    </div>
  )
}
