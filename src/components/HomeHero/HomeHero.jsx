import { useEffect, useRef, useState } from 'react'
import { aot8Settings, heroPropositions } from '../../data'
import { SiteNavbar } from '../SiteNavbar/SiteNavbar'
import { HeroContent } from './HeroContent'
import { NetworkFormation } from './NetworkFormation'
import '../NetworkPrototype/NetworkPrototype.css'

const ROTATION_DELAY = 5000
const RESUME_DELAY = 1000

export function HomeHero({ showNavbar = true }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isFormationSettled, setIsFormationSettled] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const resumeTimerRef = useRef(null)
  const interactionsRef = useRef(new Set())
  const activeFormationRef = useRef(heroPropositions[0].networkForm)
  const state = heroPropositions[activeIndex]

  useEffect(() => {
    activeFormationRef.current = state.networkForm
  }, [state.networkForm])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (isPaused || reducedMotion || !isFormationSettled) return undefined
    const timer = window.setTimeout(() => {
      setIsFormationSettled(false)
      setActiveIndex((index) => (index + 1) % heroPropositions.length)
    }, ROTATION_DELAY)
    return () => window.clearTimeout(timer)
  }, [activeIndex, isPaused, isFormationSettled, reducedMotion])

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), [])

  const pause = (source) => {
    interactionsRef.current.add(source)
    if (source === 'network') setIsFormationSettled(false)
    setIsPaused(true)
    window.clearTimeout(resumeTimerRef.current)
  }

  const handleFormationSettled = (formation) => {
    if (formation === activeFormationRef.current) setIsFormationSettled(true)
  }
  const resume = (source) => {
    interactionsRef.current.delete(source)
    if (interactionsRef.current.size > 0) return
    window.clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = window.setTimeout(() => setIsPaused(false), RESUME_DELAY)
  }

  return (
    <main
      className="network-prototype"
      aria-label="AOT Lagos 8.0"
    >
      <NetworkFormation
        formation={state.networkForm}
        reducedMotion={reducedMotion}
        onInteractionStart={pause}
        onInteractionEnd={resume}
        onFormationSettled={handleFormationSettled}
      />
      <div className="network-prototype__atmosphere" aria-hidden="true" />
      {showNavbar && <SiteNavbar />}
      <div className="network-prototype__identity">
        <p>{aot8Settings.brand.identityLabel.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
        <h1>{aot8Settings.brand.identityTitle} <span>{aot8Settings.brand.identityEdition}</span></h1>
      </div>
      <HeroContent state={state} onInteractionStart={pause} onInteractionEnd={resume} />
    </main>
  )
}
