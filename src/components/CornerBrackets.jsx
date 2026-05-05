export default function CornerBrackets({ size = 10, color = 'var(--border-gold)', inset = 10 }) {
  const s = `${size}px`;
  const base = {
    position: 'absolute',
    width: s,
    height: s,
    borderColor: color,
    borderStyle: 'solid',
    pointerEvents: 'none',
  };
  return (
    <>
      <span style={{ ...base, top: inset, left: inset, borderWidth: '1px 0 0 1px' }} />
      <span style={{ ...base, top: inset, right: inset, borderWidth: '1px 1px 0 0' }} />
      <span style={{ ...base, bottom: inset, left: inset, borderWidth: '0 0 1px 1px' }} />
      <span style={{ ...base, bottom: inset, right: inset, borderWidth: '0 1px 1px 0' }} />
    </>
  );
}
