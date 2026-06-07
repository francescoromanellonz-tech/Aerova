/**
 * FooterWave.jsx
 *
 * Champagne-gold sine wave that breathes across the bottom of the footer.
 * Site-wide signature mark, same idea as a heartbeat on a sterile spec
 * sheet, kept very subtle so it doesn't compete with content.
 *
 * Pure SVG + CSS animation, no Canvas. Honors prefers-reduced-motion via
 * a static line in CSS.
 */

const PATTERN_W = 240;   /* viewBox width of one repeat, keep small for crisp curves */
const PATTERN_H = 24;
const REPEATS   = 8;     /* render 8 copies side-by-side; animation translates by 1 */

/* Build a single sine arc as a smooth bezier. Two humps per pattern width. */
const SINGLE = (() => {
  /* path drawn from x=0 to x=PATTERN_W, y baseline at 12; amplitude 6 */
  const m = 12;
  const a = 6;
  /* Two complete sine waves (4 quarter-arcs) per pattern, chained cubic curves */
  return `M 0 ${m}
          C ${PATTERN_W * 0.125} ${m - a * 1.4}, ${PATTERN_W * 0.25 - PATTERN_W * 0.125} ${m - a * 1.4}, ${PATTERN_W * 0.25} ${m}
          C ${PATTERN_W * 0.375} ${m + a * 1.4}, ${PATTERN_W * 0.5 - PATTERN_W * 0.125} ${m + a * 1.4}, ${PATTERN_W * 0.5} ${m}
          C ${PATTERN_W * 0.625} ${m - a * 1.4}, ${PATTERN_W * 0.75 - PATTERN_W * 0.125} ${m - a * 1.4}, ${PATTERN_W * 0.75} ${m}
          C ${PATTERN_W * 0.875} ${m + a * 1.4}, ${PATTERN_W      - PATTERN_W * 0.125} ${m + a * 1.4}, ${PATTERN_W      } ${m}`;
})();

export default function FooterWave() {
  const totalW = PATTERN_W * REPEATS;
  return (
    <div
      aria-hidden="true"
      className="footer-wave-wrap"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: PATTERN_H,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${totalW} ${PATTERN_H}`}
        preserveAspectRatio="none"
        className="footer-wave-svg"
        style={{
          display: 'block',
          width: '200%',           /* wider than container so translation never reveals an edge */
          height: '100%',
          minWidth: '1600px',
        }}
      >
        <g>
          {Array.from({ length: REPEATS }, (_, i) => (
            <path
              key={i}
              d={SINGLE}
              transform={`translate(${i * PATTERN_W} 0)`}
              fill="none"
              stroke="rgba(212, 175, 55, 0.32)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
