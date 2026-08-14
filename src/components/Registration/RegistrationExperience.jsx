import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useAot8Settings } from '../../lib/useAot8Settings'
import './RegistrationExperience.css'

const transition = { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }

function RegistrationForm({ registrationType, onBack, settings }) {
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nextErrors = Object.fromEntries(settings.commonFields.flatMap((field) => {
      const value = formData.get(field.id)?.trim()
      if (field.required && !value) return [[field.id, `${field.label} is required.`]]
      if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) return [[field.id, 'Enter a valid email address.']]
      return []
    }))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setIsSubmitted(true)
  }

  if (isSubmitted) return <div className="registration-experience__success" role="status"><p>{settings.confirmation.message}</p><button type="button" onClick={onBack}>Back to registration choices</button></div>

  return (
    <form className="registration-experience__form" noValidate onSubmit={submit}>
      <button className="registration-experience__back" type="button" onClick={onBack}>← Back</button>
      <h2>{registrationType.formTitle}</h2>
      <div className="registration-experience__fields">
        {settings.commonFields.map((field) => <label key={field.id} htmlFor={field.id}>{field.label} {field.required ? <em>Required</em> : null}<input aria-invalid={Boolean(errors[field.id])} aria-describedby={errors[field.id] ? `${field.id}-error` : undefined} autoComplete={field.autoComplete} id={field.id} name={field.id} required={field.required} type={field.type} />{errors[field.id] ? <span id={`${field.id}-error`} role="alert">{errors[field.id]}</span> : null}</label>)}
      </div>
      <button className="registration-experience__submit" type="submit">{registrationType.submitLabel}</button>
    </form>
  )
}

export function RegistrationExperience() {
  const [activeType, setActiveType] = useState(null)
  const { registrationSettings } = useAot8Settings()
  const settings = registrationSettings.data
  const reducedMotion = useReducedMotion()
  const activeRegistration = settings.types.find((type) => type.id === activeType)
  const motionProps = { initial: reducedMotion ? false : { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: reducedMotion ? undefined : { opacity: 0, y: -12 }, transition: { ...transition, duration: reducedMotion ? 0 : transition.duration } }

  if (!settings.isOpen) {
    return <section className="registration-experience" aria-labelledby="registration-content-title"><div className="registration-experience__success" role="status"><p id="registration-content-title">Registration is currently closed.</p></div></section>
  }

  return (
    <section className="registration-experience" aria-labelledby="registration-content-title">
      <AnimatePresence mode="wait">
        {!activeRegistration ? (
          <motion.div {...motionProps} className="registration-experience__selection" key="selection">
            <h2 id="registration-content-title">{settings.introduction}</h2>
            <div className="registration-experience__types">
              {settings.types.map((type) => <button type="button" key={type.id} onClick={() => setActiveType(type.id)}>{type.label}<span aria-hidden="true">↗</span></button>)}
            </div>
          </motion.div>
        ) : <motion.div {...motionProps} key={activeRegistration.id}><RegistrationForm registrationType={activeRegistration} onBack={() => setActiveType(null)} settings={settings} /></motion.div>}
      </AnimatePresence>
    </section>
  )
}
