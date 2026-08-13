import { useEffect, useRef, useState } from 'react'
import { sessions, speakers } from '../../data'
import './ProgrammeSection.css'

const clamp = (value) => Math.min(Math.max(value, 0), 1)

function sessionIndex(progress, length) {
  const timelineProgress = clamp((progress - 0.2) / 0.64)
  return Math.min(Math.floor(timelineProgress * length), length - 1)
}

export function ProgrammeSection() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const programme = [...sessions.data].sort((first, second) => first.displayOrder - second.displayOrder)
  const activeIndex = sessionIndex(progress, programme.length)
  const activeSession = programme[activeIndex]
  const activeSpeakers = activeSession.speakers.map((speakerId) => speakers.data.find((speaker) => speaker.id === speakerId)).filter(Boolean)

  useEffect(() => {
    let frameId
    const updateProgress = () => {
      const section = sectionRef.current
      if (!section) return
      const bounds = section.getBoundingClientRect()
      const range = Math.max(section.offsetHeight - window.innerHeight, 1)
      const next = clamp(-bounds.top / range)
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
    <section ref={sectionRef} className="programme-section" aria-labelledby="programme-title" style={{ '--programme-rail': `${((activeIndex + 1) / programme.length) * 100}%` }}>
      <div className="programme-section__pinned">
        <div className="programme-section__atmosphere" aria-hidden="true" />
        <header className="programme-section__header">
          <p>{sessions.meta.section.eyebrow}</p>
          <h2 id="programme-title">{sessions.meta.section.heading.map((line) => <span key={line}>{line}</span>)}</h2>
        </header>

        <div className="programme-section__timeline" aria-label={sessions.meta.section.progressLabel}>
          <div className="programme-section__rail" aria-hidden="true"><span /></div>
          <ol>
            {programme.map((session, index) => (
              <li className={index === activeIndex ? 'programme-section__item programme-section__item--active' : index < activeIndex ? 'programme-section__item programme-section__item--past' : 'programme-section__item'} key={session.id}>
                <time>{session.startTime}</time>
                <span>{session.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="programme-section__speakers" key={activeSession.id} aria-label={`Speakers for ${activeSession.title}`}>
          {activeSpeakers.length > 0 ? (
            <div className={`programme-section__speaker-grid programme-section__speaker-grid--${Math.min(activeSpeakers.length, 3)}`}>
              {activeSpeakers.map((speaker) => (
                <article className="programme-section__speaker" key={speaker.id}>
                  <img src={speaker.image.src} alt={speaker.image.alt} />
                  <h3>{speaker.name}</h3>
                  {speaker.linkedinUrl ? <a href={speaker.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${speaker.name} on LinkedIn`}>LinkedIn <span aria-hidden="true">↗</span></a> : null}
                </article>
              ))}
            </div>
          ) : <p className="programme-section__empty">No speakers assigned</p>}
        </aside>
      </div>
    </section>
  )
}
