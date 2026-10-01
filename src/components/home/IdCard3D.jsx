import { useRef } from 'react'
import { LOGO, SITE } from '../../data/site'
import { useTilt3d } from '../../hooks/useTilt3d'
import s from './IdCard3D.module.css'

/*
  Homepage ID card. Purely presentational: every value is static frontend
  content (no API). The barcode is decorative — bars are derived from the ID
  number so they stay stable, but it is not a scannable symbology.
*/
const CARD = {
  event: `${SITE.festUpper} ${SITE.year}`,
  idNumber: `ITSA-${SITE.year}-0001`,
  validity: '30 OCT 2026',
}

const DETAILS = [
  { label: 'Workshop', value: 'To be announced' },
  { label: 'Date of Event', value: 'October 30, 2026' },
  { label: 'ID Card Number', value: CARD.idNumber },
]

const BARCODE_HEIGHT = 30

function barcodeBars(text) {
  const bars = []
  let x = 0
  for (const char of `*${text}*`) {
    const code = char.charCodeAt(0)
    for (let bit = 0; bit < 4; bit += 1) {
      const width = ((code >> bit) & 1) + 1
      const gap = ((code >> (bit + 3)) & 1) + 1
      bars.push({ x, width })
      x += width + gap
    }
  }
  return { bars, width: x }
}

const BARCODE = barcodeBars(CARD.idNumber)

export default function IdCard3D() {
  const sceneRef = useRef(null)
  const cardRef = useRef(null)
  useTilt3d(sceneRef, cardRef, s.isHovering)

  return (
    <div className={s.area}>
      <div
        ref={sceneRef}
        className={s.scene}
        role="img"
        aria-label={`${CARD.event} ID card — ${SITE.branch} Students Association, ${SITE.college}`}
      >
        <div ref={cardRef} className={s.card} aria-hidden="true">
          <div className={s.top}>
            <div className={s.band}>
              <span className={s.slot} />
              <strong className={s.event}>{CARD.event}</strong>
              <span className={s.college}>{SITE.college}</span>
            </div>

            <div className={s.identity}>
              <div className={s.emblem}>
                <img src={LOGO.src} srcSet={LOGO.srcSet} sizes="92px" width="92" height="95" alt="" />
              </div>
              <strong className={s.branch}>{SITE.branch}</strong>
              <span className={s.org}>Students Association</span>
            </div>
          </div>

          <div className={s.bottom}>
            <dl className={s.details}>
              {DETAILS.map((detail) => (
                <div key={detail.label} className={s.detail}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>

            <div className={s.footer}>
              <div className={s.validity}>
                <span>Validity</span>
                <strong>{CARD.validity}</strong>
              </div>

              <svg
                className={s.barcode}
                viewBox={`0 0 ${BARCODE.width} ${BARCODE_HEIGHT}`}
                preserveAspectRatio="none"
                focusable="false"
              >
                {BARCODE.bars.map((bar) => (
                  <rect key={bar.x} x={bar.x} y="0" width={bar.width} height={BARCODE_HEIGHT} />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
