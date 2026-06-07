/**
 * ProductVideo.jsx
 * Editorial autoplay loop for the AEROVA product page.
 * Honors prefers-reduced-motion (renders the poster image instead).
 * Honors Save-Data (renders the poster image instead).
 */

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const VIDEO_SRC  = '/assets/Video/machine--diagonal water dispenser animation view NEW.mp4';
const POSTER_SRC = '/assets/images/machine-diagonal-dark-studio-v2.png';

export default function ProductVideo() {
  const { language } = useLanguage();
  const videoRef = useRef(null);
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!reduced && !saveData) setShouldRenderVideo(true);
  }, []);

  return (
    <section
      className="prod-video relative overflow-hidden"
      style={{
        paddingTop: 'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background: 'var(--bg)',
      }}
      aria-labelledby="prod-video-headline"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <header className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
          <span
            className="inline-block text-[10px] md:text-[11px] uppercase mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--gold)', fontWeight: 500 }}
          >
            {language === 'vi' ? 'Xem nó vận hành' : 'Watch it work'}
          </span>
          <h2
            id="prod-video-headline"
            className="font-prata text-3xl md:text-4xl lg:text-[2.8rem] leading-[1.1] mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {language === 'vi'
              ? 'Nước, từ không khí, chỉ trong vài giây.'
              : 'Water, from air, in seconds.'}
          </h2>
          <p
            className="text-sm md:text-base max-w-xl mx-auto"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {language === 'vi'
              ? 'Vòi đôi nóng/lạnh, bảng điều khiển LCD, vận hành ở 45 dB. Cận cảnh sản phẩm thực.'
              : 'Dual hot/cold dispense, LCD control panel, 45 dB operation. A close-up of the actual machine in motion.'}
          </p>
        </header>

        <div
          className="relative mx-auto"
          style={{
            maxWidth: '1100px',
            aspectRatio: '16 / 9',
            background: 'var(--bg-alt)',
            border: '1px solid var(--border-gold-faint)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px var(--border-gold-faint)',
          }}
        >
          {/* Corner brackets, signature decorative element */}
          <span aria-hidden="true" className="absolute top-3 left-3 w-4 h-4 pointer-events-none"
            style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
          <span aria-hidden="true" className="absolute top-3 right-3 w-4 h-4 pointer-events-none"
            style={{ borderTop: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
          <span aria-hidden="true" className="absolute bottom-3 left-3 w-4 h-4 pointer-events-none"
            style={{ borderBottom: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
          <span aria-hidden="true" className="absolute bottom-3 right-3 w-4 h-4 pointer-events-none"
            style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />

          {shouldRenderVideo ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="AEROVA LT-AWG20G product demo loop, water dispensing from dual taps"
            />
          ) : (
            <img
              src={POSTER_SRC}
              alt="AEROVA LT-AWG20G product photo, diagonal view in dark studio"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Caption intentionally omitted, current loop is a Kling-AI cinematic
            reveal of the locked product silhouette, not real footage. Add a real
            owner-shot demo here when one exists. */}
      </div>
    </section>
  );
}
