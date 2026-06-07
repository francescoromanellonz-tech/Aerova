import { useState } from 'react';

/**
 * Drop-in replacement for <img> that starts blurred and clears on load.
 * Passes all props through unchanged, only manages the loading class.
 */
function BlurImage({ className = '', style, onLoad, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      loading="lazy"
      {...props}
      className={`${className} ${loaded ? '' : 'loading'}`.trim()}
      style={style}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}

export default BlurImage;
