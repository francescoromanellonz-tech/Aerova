/* ── Section break — luxury architectural hairline + water drop ── */
const SectionBreak = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'relative',
      height:   0,
      overflow: 'visible',
      zIndex:   10,
    }}
  >
    <div style={{
      position:        'absolute',
      left:            0,
      right:           0,
      top:             0,
      transform:       'translateY(-50%)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             '16px',
      padding:         '0 40px',
    }}>
      <span style={{
        flex:       1,
        maxWidth:   '380px',
        height:     '1px',
        background: 'linear-gradient(to right, transparent 0%, var(--section-break-line) 100%)',
      }} />
      <svg width="9" height="13" viewBox="0 0 9 13" fill="none" style={{ flexShrink: 0 }}>
        <path d="M4.5 0C4.5 0 0 5.6 0 8.6a4.5 4.5 0 009 0C9 5.6 4.5 0 4.5 0z"
          fill="var(--section-break-drop)" />
      </svg>
      <span style={{
        flex:       1,
        maxWidth:   '380px',
        height:     '1px',
        background: 'linear-gradient(to left, transparent 0%, var(--section-break-line) 100%)',
      }} />
    </div>
  </div>
);

export default SectionBreak;
