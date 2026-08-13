import { aot8Settings } from '../../data'
import { useCountdown } from '../../hooks/useCountdown'
import { NetworkFormation } from '../HomeHero/NetworkFormation'
import './EventSection.css'

function formatValue(value) {
  return String(value).padStart(2, '0')
}

function formatEventDate({ start, timezone }) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: timezone,
  }).format(new Date(start))
}

export function EventSection() {
  const countdown = useCountdown(aot8Settings.dates.start)
  const venue = aot8Settings.venue
  const dateLabel = formatEventDate(aot8Settings.dates)
  const content = aot8Settings.eventSection
  const countdownLabels = [['days', content.daysLabel], ['hours', content.hoursLabel], ['minutes', content.minutesLabel], ['seconds', content.secondsLabel]]

  return (
    <div className="event-section-track">
    <section className="event-section event-section--entered" aria-labelledby="event-section-title">
      <div className="event-section__network" aria-hidden="true">
        <NetworkFormation formation="eventField" reducedMotion={false} onInteractionStart={() => {}} onInteractionEnd={() => {}} onFormationSettled={() => {}} />
      </div>
      <div className="event-section__atmosphere" aria-hidden="true" />
      <div className="event-section__content">
        <header className="event-section__header">
          <p className="event-section__eyebrow">{content.eyebrow}</p>
          <h2 id="event-section-title">{dateLabel}</h2>
        </header>

        <div className="event-section__details">
          <div>
            <i className="event-section__venue-icon" aria-hidden="true" />
            <div>
              <span>{content.venueLabel}</span>
              <strong>{venue.city}</strong>
              <small>{venue.name ?? content.venueFallback}</small>
            </div>
          </div>
          <div>
            <i className="event-section__time-icon" aria-hidden="true" />
            <div>
              <span>{content.timeLabel}</span>
              <strong>{aot8Settings.dates.time ?? content.timeFallback}</strong>
              <small>{aot8Settings.dates.time ? aot8Settings.dates.timezone : content.timeFallbackTimezone}</small>
            </div>
          </div>
        </div>

        <div className="event-section__countdown" aria-label={content.countdownLabel}>
          {countdownLabels.map(([key, label]) => (
            <div className={key === 'days' ? 'event-section__countdown-days' : ''} key={key}>
              <strong>{formatValue(countdown[key])}</strong>
              {key === 'days' ? <span>{label}<em>{content.daysSuffix}</em></span> : <span>{label}</span>}
            </div>
          ))}
        </div>

        <a className="network-prototype__cta event-section__cta" href={content.registrationCta.href}>
          {content.registrationCta.label}
        </a>
      </div>
    </section>
    </div>
  )
}
