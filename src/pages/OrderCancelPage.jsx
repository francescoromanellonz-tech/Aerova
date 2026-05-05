import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LangLink from '../components/LangLink';
import gsap from 'gsap';

export default function OrderCancelPage() {
  useEffect(() => {
    gsap.from('.cancel-content > *', {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Cancelled — AEROVA</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section
        style={{
          background:    'var(--bg)',
          minHeight:     '100vh',
          display:       'flex',
          alignItems:    'center',
          paddingTop:    'clamp(110px, 18vh, 170px)',
          paddingBottom: 'clamp(60px, 10vh, 100px)',
        }}
      >
        <div className="max-w-2xl mx-auto px-6 md:px-10 cancel-content">

          {/* X circle */}
          <div
            className="mb-8 flex items-center justify-center"
            style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--border-gold-faint)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--text-sub)', opacity: 0.45 }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>

          <p className="text-[9px] uppercase mb-4" style={{ letterSpacing: '0.36em', color: 'var(--text-sub)', fontWeight: 600, opacity: 0.55 }}>
            Payment Cancelled
          </p>

          <h1 className="font-prata mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            No Charge Was Made
          </h1>

          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '440px' }}>
            Your order was not completed and nothing was charged to your card. You can return to the service page whenever you are ready, or contact us if you need help.
          </p>

          <div className="flex flex-wrap gap-4">
            <LangLink to="/service" className="aerova-btn" style={{ textDecoration: 'none' }}>
              Back to Service
            </LangLink>
            <LangLink
              to="/contact"
              className="aerova-btn"
              style={{ textDecoration: 'none', background: 'transparent', borderColor: 'var(--border-gold)', color: 'var(--gold)' }}
            >
              Contact Us
            </LangLink>
          </div>
        </div>
      </section>
    </>
  );
}
