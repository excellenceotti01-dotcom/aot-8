import { useEffect, useRef, useState } from 'react'
import { aboutAot8 } from '../../data'
import { NetworkFormation } from '../HomeHero/NetworkFormation'
import './AboutAot8.css'

export function AboutAot8() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const isAbstractNetwork = progress >= 0.29

  useEffect(() => {
    let frameId
    const updateProgress = () => {
      const section = sectionRef.current
      if (!section) return
      const bounds = section.getBoundingClientRect()
      const range = Math.max(section.offsetHeight - window.innerHeight, 1)
      const next = Math.min(Math.max(-bounds.top / range, 0), 1)
      setProgress((current) => (Math.abs(current - next) > 0.002 ? next : current))
    }
    const onScroll = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="about-aot8" aria-labelledby="about-aot8-title" style={{ '--about-progress': progress }}>
      <div className="about-aot8__pinned">
        <div className="about-aot8__network" aria-hidden="true">
          <NetworkFormation formation={isAbstractNetwork ? 'aboutFrame' : 'africa'} reducedMotion={false} onInteractionStart={() => {}} onInteractionEnd={() => {}} onFormationSettled={() => {}} />
        </div>

        <div className="about-aot8__intro">
          <header className="about-aot8__header">
            <p className="about-aot8__eyebrow">{aboutAot8.eyebrow}</p>
            <h2 id="about-aot8-title">{aboutAot8.title.map((title) => <span key={title}>{title}</span>)}</h2>
          </header>
          <div className="about-aot8__question"><p>{aboutAot8.question}</p></div>
        </div>

        <div className="about-aot8__philosophy">
          <div className="about-aot8__pillars" aria-label={aboutAot8.pillars.join(' times ')}>
            {aboutAot8.pillars.map((pillar, index) => (
              <span key={pillar}>{index > 0 && <b aria-hidden="true">×</b>}{pillar}</span>
            ))}
          </div>
          <div className="about-aot8__copy">
            {aboutAot8.statements.map((statement) => <p key={statement}>{statement}</p>)}
          </div>
          <a className="network-prototype__cta about-aot8__cta" href={aboutAot8.cta.href}>
            {aboutAot8.cta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
