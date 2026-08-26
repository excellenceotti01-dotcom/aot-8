import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './HoverBrandLogo.css'

export function HoverBrandLogo({ brands, minimumItems = brands.length, label, contextLabel, defaultText }) {
  const [hoveredId, setHoveredId] = useState(null)
  const reduceMotion = useReducedMotion()
  const activeBrand = brands.find((brand) => brand.id === hoveredId)

  const activateBrand = (event, brand) => {
    if (!brand.destinationUrl) {
      setHoveredId((current) => current === brand.id ? null : brand.id)
    } else if (hoveredId !== brand.id) {
      event.preventDefault()
      setHoveredId(brand.id)
    }
  }

  return (
    <div className={`hover-brand-logo${activeBrand ? ' hover-brand-logo--focused' : ''}`} onPointerLeave={() => setHoveredId(null)}>
      <div className="hover-brand-logo__context" aria-live="polite">
        <p>{contextLabel}</p>
        <div>
          <AnimatePresence mode="wait">
            <motion.span key={activeBrand?.id ?? 'default'} initial={reduceMotion ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduceMotion ? undefined : { y: -12, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}>{activeBrand?.name ?? defaultText}</motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="hover-brand-logo__grid" aria-label={label}>
        {brands.map((brand) => {
          const isActive = hoveredId === brand.id
          const sharedProps = {
            className: `hover-brand-logo__item${isActive ? ' hover-brand-logo__item--active' : ''}`,
            onPointerEnter: () => setHoveredId(brand.id),
            onFocus: () => setHoveredId(brand.id),
            onBlur: () => setHoveredId(null),
            onClick: (event) => activateBrand(event, brand),
          }
          const content = <><img src={brand.logo.src} alt={brand.logo.alt} /><span>{brand.name}</span></>
          return brand.destinationUrl
            ? <a {...sharedProps} href={brand.destinationUrl} target="_blank" rel="noreferrer" key={brand.id}>{content}</a>
            : <button {...sharedProps} type="button" key={brand.id}>{content}</button>
        })}
        {Array.from({ length: Math.max(0, minimumItems - brands.length) }, (_, index) => <span className="hover-brand-logo__placeholder" aria-hidden="true" key={`placeholder-${index}`} />)}
      </div>
    </div>
  )
}
