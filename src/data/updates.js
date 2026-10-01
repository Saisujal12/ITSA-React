/*
  Homepage "Latest Updates" content.

  Everything here is derived from existing gallery data (src/data/gallery.js)
  so the homepage never shows invented announcements. To post a real
  announcement, add it to EXTRA_UPDATES below (newest first); if both lists
  are empty, the homepage shows an empty state instead.
*/

import { GALLERY_HERO_SLIDES, GALLERY_SECTIONS } from './gallery'

const RECENT_ALBUMS = GALLERY_SECTIONS.find((section) => section.id === 'recent-events')?.albums ?? []

/** @type {{ id: string, date: string, category: string, title: string, description: string, to: string }[]} */
const EXTRA_UPDATES = []

export const LATEST_UPDATES = [
  ...EXTRA_UPDATES,
  ...RECENT_ALBUMS.map((album) => ({
    id: album.id,
    date: album.date,
    category: album.category,
    title: album.title,
    description: album.description,
    to: '/gallery',
  })),
]

/*
  Association Highlights carousel: photos from recent association events
  (captioned with their album), then the remaining general gallery photos.
  Image keys that have no file yet are filtered out by the carousel.
*/
const albumSlides = RECENT_ALBUMS.flatMap((album) =>
  album.photos.map((photo) => ({
    image: photo.image,
    alt: photo.alt,
    title: album.title,
    meta: `${album.category} · ${album.date}`,
  })),
)

const gallerySlides = GALLERY_HERO_SLIDES.map((slide) => ({
  image: slide.image,
  alt: slide.alt,
  title: 'Association moments',
  meta: 'GALLERY',
}))

export const HIGHLIGHT_SLIDES = [...albumSlides, ...gallerySlides].filter(
  (slide, index, all) => all.findIndex((other) => other.image === slide.image) === index,
)
