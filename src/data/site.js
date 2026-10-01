import logo128 from '../assets/images/brand/it-association-logo-128.webp'
import logo256 from '../assets/images/brand/it-association-logo-256.webp'
import logo512 from '../assets/images/brand/it-association-logo-512.webp'
import profilePlaceholder from '../assets/images/brand/profile-placeholder-320.webp'

export const SITE = {
  name: 'IT Students Association',
  nameUpper: 'IT STUDENTS ASSOCIATION',
  college: 'KITSW',
  collegeSpaced: 'K I T S W',
  department: 'Department of Information Technology',
  branch: 'Information Technology',
  year: 2026,
  // Official spelling. Legacy pages also used Samshodini / Sumshodini / Samshodhini.
  fest: 'Sumshodhini',
  festUpper: 'SUMSHODHINI',
  motto: 'Learn · Build · Grow',
}

export const LOGO = {
  src: logo256,
  srcSet: `${logo128} 128w, ${logo256} 256w, ${logo512} 512w`,
  width: 977,
  height: 1014,
  alt: 'IT Students Association logo',
}

export const PROFILE_PLACEHOLDER = profilePlaceholder

export const SOCIAL = {
  instagram: 'https://www.instagram.com/it_kitsw?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
}

/** Builds a document title in the "Page | IT Students Association KITSW" format. */
export function pageTitle(page) {
  return page ? `${page} | ${SITE.name} ${SITE.college}` : `${SITE.name} | ${SITE.college}`
}
