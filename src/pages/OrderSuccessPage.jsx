import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import LangLink from '../components/LangLink';
import OrderSuccessCinematic from '../components/OrderSuccessCinematic';
import gsap from 'gsap';

const nextSteps = {
  purchase: [
    'You will receive a payment confirmation email from Stripe.',
    'Our team will contact you within 24 hours to confirm your order details.',
    'Your AEROVA LT-AWG20G will be shipped and installed at your location.',
  ],
};

export default function OrderSuccessPage() {
  // Lease was removed 2026-05-11; we only support outright purchase confirmations.
  const type = 'purchase';
  const pageRef = useRef(null);

  useEffect(() => {
    /* The cinematic component owns the entrance choreography for the
       hero block (drop, ripples, wordmark, copy). The next-steps card
       and CTA buttons still get a small staggered fade so they don't
       pop in instantly after the wordmark settles. */
    const ctx = gsap.context(() => {
      gsap.from('.success-tail > *', {
        y: 18, opacity: 0, duration: 0.7, stagger: 0.08,
        ease: 'power3.out', delay: 1.6,
        clearProps: 'transform,opacity',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Confirmed, AEROVA</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section
        ref={pageRef}
        style={{
          background:    'var(--bg)',
          minHeight:     '100vh',
          display:       'flex',
          alignItems:    'center',
          paddingTop:    'clamp(110px, 18vh, 170px)',
          paddingBottom: 'clamp(60px, 10vh, 100px)',
        }}
      >
        <div className="max-w-2xl mx-auto px-6 md:px-10 success-content">

          <OrderSuccessCinematic />

          <div className="success-tail">
            {/* Next steps */}
            <div style={{
              marginTop: '2.5rem',
              marginBottom: '2.5rem', padding: '1.5rem 1.75rem',
              border: '1px solid var(--border-gold)',
              background: 'var(--surface-gold)',
              borderRadius: 2,
            }}>
              <p style={{
                fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em',
                color: 'var(--gold)', fontWeight: 700, marginBottom: '1.25rem',
              }}>
                What Happens Next
              </p>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {nextSteps[type].map((step, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    fontSize: '0.875rem', color: 'var(--text-sub)', fontWeight: 400, lineHeight: 1.6,
                  }}>
                    <span className="font-prata" style={{
                      fontSize: '0.75rem', color: 'var(--gold)', paddingTop: 2, flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <LangLink to="/" className="aerova-btn" style={{ textDecoration: 'none' }}>
                <span>Return Home</span>
              </LangLink>
              <LangLink to="/contact" className="aerova-btn aerova-btn--outline" style={{ textDecoration: 'none' }}>
                <span>Contact Us</span>
              </LangLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
