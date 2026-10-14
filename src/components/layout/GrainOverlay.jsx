/* SVG grain overlay — pure CSS, no JS, no performance cost */
export default function GrainOverlay() {
  return (
    <>
      {/* Hidden SVG filter definition */}
      <svg className="grain-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>
        </defs>
      </svg>
      {/* Grain overlay div */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  )
}
