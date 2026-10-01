import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ChevronLeft, ChevronRight, Megaphone, Pause, Play } from 'lucide-react'
import { HIGHLIGHT_SLIDES, LATEST_UPDATES } from '../../data/updates'
import { SITE } from '../../data/site'
import { useCarousel } from '../../hooks/useCarousel'
import { resolveImage } from '../../utils/assets'
import { cx } from '../../utils/cx'
import s from './LatestUpdates.module.css'

const SLIDES = HIGHLIGHT_SLIDES.map((slide) => ({ ...slide, image: resolveImage(slide.image) })).filter(
  (slide) => slide.image,
)

function HighlightsCarousel() {
  const [paused, setPaused] = useState(false)
  const { index, goTo, next, prev, isRevealed, regionProps } = useCarousel(SLIDES.length, { paused })
  const multiple = SLIDES.length > 1

  if (!SLIDES.length) {
    return <p className={s.empty}>Photos from association activities will appear here.</p>
  }

  return (
    <div
      {...regionProps}
      className={s.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${SITE.name} highlights`}
    >
      <div className={s.viewport}>
        {SLIDES.map((slide, slideIndex) => (
          <figure
            key={slide.alt + slideIndex}
            className={cx(s.slide, slideIndex === index && s.active)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${SLIDES.length}`}
            aria-hidden={slideIndex !== index}
          >
            {isRevealed(slideIndex) && (
              <img
                src={slide.image.src}
                srcSet={slide.image.srcSet}
                sizes="(max-width: 900px) 92vw, 55vw"
                alt={slide.alt}
                loading="lazy"
                decoding="async"
              />
            )}
            <figcaption className={s.caption}>
              <span>{slide.meta}</span>
              <strong>{slide.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>

      {multiple && (
        <div className={s.controls}>
          <div className={s.dots}>
            {SLIDES.map((slide, slideIndex) => (
              <button
                key={slide.alt + slideIndex}
                type="button"
                className={cx(s.dot, slideIndex === index && s.active)}
                aria-label={`Show highlight ${slideIndex + 1}`}
                aria-current={slideIndex === index || undefined}
                onClick={() => goTo(slideIndex)}
              />
            ))}
          </div>

          <div className={s.buttons}>
            <button
              type="button"
              className={s.control}
              aria-label={paused ? 'Play highlights' : 'Pause highlights'}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
            <button type="button" className={s.control} aria-label="Previous highlight" onClick={prev}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className={s.control} aria-label="Next highlight" onClick={next}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function UpdatesList() {
  if (!LATEST_UPDATES.length) {
    return (
      <div className={s.emptyState}>
        <Megaphone aria-hidden="true" />
        <p>No updates have been posted yet. Check back soon for announcements from the association.</p>
      </div>
    )
  }

  return (
    <ol className={s.updates}>
      {LATEST_UPDATES.map((update) => (
        <li key={update.id} className={s.update}>
          <p className={s.updateMeta}>
            <span>{update.category}</span>
            <span aria-hidden="true">·</span>
            <span>{update.date}</span>
          </p>
          <h4>{update.title}</h4>
          <p className={s.updateText}>{update.description}</p>
          <Link to={update.to} className={s.updateLink}>
            View in gallery <ArrowRight aria-hidden="true" />
            <span className="visually-hidden">: {update.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  )
}

export default function LatestUpdates() {
  return (
    <section className={cx('section', s.section)} aria-labelledby="home-updates-title">
      <div className="container">
        <h2 id="home-updates-title" className={s.title}>
          Latest <span className="text-primary">Updates</span>
        </h2>

        <div className={s.grid}>
          <div className={s.panel}>
            <h3 className={s.panelTitle}>Association Highlights</h3>
            <HighlightsCarousel />
          </div>

          <div className={s.panel}>
            <h3 className={s.panelTitle}>Latest Updates</h3>
            <UpdatesList />
          </div>
        </div>
      </div>
    </section>
  )
}
