import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LangLink from '../components/LangLink';
import gsap from 'gsap';

const nextSteps = {
  purchase: [
    'You will receive a payment confirmation email from Stripe.',
    'Our team will contact you within 24 hours to confirm your order details.',
    'Your AEROVA LT-AWG20G will be shipped and installed at your location.',
  ],
  lease: [
    'You will receive a payment confirmation email from Stripe.',
    'Our team will contact you within 24 hours to set up your lease agreement.',
    'Your AEROVA LT-AWG20G will be delivered and installed at your location.',
    'Monthly billing begins after installation is complete.',
  ],
};

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') === 'lease' ? 'lease' : 'purchase';
  const isLease = type === 'lease';
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.success-content > *', {
        y: 24, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Confirmed — AEROVA</title>
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

          {/* Check circle */}
          <div
            className="mb-8"
            style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '2px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--gold)' }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <p style={{
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.36em',
            color: 'var(--gold)', fontWeight: 700, marginBottom: '1rem',
          }}>
            Order Confirmed
          </p>

          <h1 className="font-prata" style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            color: 'var(--text-main)',
            letterSpacing: '-0.01em',
            marginBottom: '1.25rem',
            lineHeight: 1.15,
          }}>
            {isLease ? 'Lease Confirmed' : 'Thank You for Your Order'}
          </h1>

          <p style={{
            fontSize: '0.9375rem', lineHeight: 1.75,
            color: 'var(--text-sub)', fontWeight: 400, maxWidth: 460,
            marginBottom: '2.5rem',
          }}>
            {isLease
              ? 'Your lease has been processed successfully. Our team will be in touch within 24 hours.'
              : 'Your payment has been processed successfully. Our team will be in touch within 24 hours.'}
          </p>

          {/* Next steps */}
          <div style={{
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

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <LangLink to="/" className="aerova-btn" style={{ textDecoration: 'none' }}>
              <span>Return Home</span>
            </LangLink>
            <LangLink to="/contact" className="aerova-btn aerova-btn--outline" style={{ textDecoration: 'none' }}>
              <span>Contact Us</span>
            </LangLink>
          </div>
        </div>
      </section>
    </>
  );
}
