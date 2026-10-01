import { Link } from 'react-router'
import { FOOTER_COLUMNS } from '../../data/navigation'
import { LOGO, SITE, SOCIAL } from '../../data/site'
import s from './Footer.module.css'

// lucide-react no longer ships brand icons; this matches its outline style.
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.grid}>
          <div className={s.brand}>
            <div className={s.brandTitle}>
              <img src={LOGO.src} srcSet={LOGO.srcSet} sizes="44px" width="44" height="44" alt="" />
              <span>{SITE.nameUpper}</span>
            </div>
            <p>
              {SITE.branch.toUpperCase()}
              <br />
              {SITE.department}, {SITE.college}
            </p>
            <div className={s.social}>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE.name} on Instagram`}
                title="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} className={s.column} aria-label={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => (
                <Link key={link.to + link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className={s.bottom}>
          <p>
            © {SITE.year} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.motto}</p>
        </div>
      </div>
    </footer>
  )
}
