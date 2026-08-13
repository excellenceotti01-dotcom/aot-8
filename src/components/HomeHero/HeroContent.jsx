export function HeroContent({ state, onInteractionStart, onInteractionEnd }) {
  return (
    <section className="network-prototype__content">
      <p className="network-prototype__eyebrow">{state.eyebrow}</p>
      <div className="network-prototype__message" key={state.id}>
        <h2>{state.headline}</h2>
        <p>{state.description}</p>
        <a
          className="network-prototype__cta"
          href={state.cta.href}
          onPointerEnter={() => onInteractionStart('cta')}
          onPointerLeave={() => onInteractionEnd('cta')}
          onFocus={() => onInteractionStart('cta')}
          onBlur={() => onInteractionEnd('cta')}
        >
          {state.cta.label}
        </a>
      </div>
    </section>
  )
}
