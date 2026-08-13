import { useEffect, useRef, useState } from 'react'
import { peopleBehindAot8 } from '../../data'
import './PeopleBehindAot8.css'

const transitionRanges = [
  { from: 0.22, to: 0.38, current: 0, next: 1 },
  { from: 0.58, to: 0.74, current: 1, next: 2 },
]

function clamp(value) {
  return Math.min(Math.max(value, 0), 1)
}

function getStageState(progress) {
  const transition = transitionRanges.find(({ from, to }) => progress >= from && progress <= to)
  if (!transition) {
    if (progress < transitionRanges[0].from) return { primary: 0 }
    if (progress < transitionRanges[1].from) return { primary: 1 }
    return { primary: 2 }
  }

  const phase = clamp((progress - transition.from) / (transition.to - transition.from))
  return {
    current: transition.current,
    next: transition.next,
    currentProgress: clamp(phase * 2),
    nextProgress: clamp((phase - 0.5) * 2),
  }
}

function profileStyle(index, stage) {
  if (stage.primary !== undefined) return { '--person-opacity': index === stage.primary ? 1 : 0, '--person-shift': '0vw', '--person-scale': 1 }
  if (index === stage.current) return { '--person-opacity': 1 - stage.currentProgress, '--person-shift': `${stage.currentProgress * -9}vw`, '--person-scale': 1 - stage.currentProgress * 0.04 }
  if (index === stage.next) return { '--person-opacity': stage.nextProgress, '--person-shift': `${(1 - stage.nextProgress) * 9}vw`, '--person-scale': 0.96 + stage.nextProgress * 0.04 }
  return { '--person-opacity': 0, '--person-shift': '9vw', '--person-scale': 0.96 }
}

function SocialIcon({ platform }) {
  return <span aria-hidden="true">{platform === 'linkedin' ? 'in' : platform === 'facebook' ? 'f' : '◎'}</span>
}

export function PeopleBehindAot8() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const stage = getStageState(progress)

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
    <section ref={sectionRef} className="people-behind" aria-labelledby="people-behind-title">
      <div className="people-behind__pinned">
        <p className="people-behind__eyebrow" id="people-behind-title">{peopleBehindAot8.section.heading}</p>
        <div className="people-behind__stage">
          {peopleBehindAot8.data.map((person, index) => {
            const socials = Object.entries(person.socials).filter(([, href]) => Boolean(href))
            const isCurrent = index === stage.primary || index === stage.current || index === stage.next
            return (
              <article className="people-behind__person" key={person.id} style={profileStyle(index, stage)} aria-hidden={!isCurrent}>
                <div className="people-behind__portrait">
                  <img src={person.image} alt="" />
                </div>
                <div className="people-behind__content">
                  <p className="people-behind__role">{person.role}</p>
                  <h2>{person.name}</h2>
                  <p className="people-behind__title">{person.title}</p>
                  <p className="people-behind__bio">{person.biography}</p>
                  {socials.length > 0 && (
                    <nav className="people-behind__socials" aria-label={`${person.name} social links`}>
                      {socials.map(([platform, href]) => <a href={href} key={platform} aria-label={`${person.name} on ${platform}`}><SocialIcon platform={platform} /></a>)}
                    </nav>
                  )}
                  <p className="people-behind__index">{String(index + 1).padStart(2, '0')} <span>/ {peopleBehindAot8.section.totalLabel}</span></p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
