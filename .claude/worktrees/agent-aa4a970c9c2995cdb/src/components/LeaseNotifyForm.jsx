/**
 * LeaseNotifyForm.jsx
 * Inline email-capture form replacing the disabled "Coming Soon" lease button
 * on /service. Subscribes the email to Mailchimp tagged with `lease-notify`
 * so the team can blast a launch announcement to interested leads.
 */

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { isValidEmail } from '../utils/validate';
import { subscribeMailchimp } from '../utils/mailchimp';

export default function LeaseNotifyForm() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | invalid
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setStatus('invalid'); return; }
    setStatus('loading');
    const result = await subscribeMailchimp(email, { tag: 'lease-notify', lang: language });
    if (result.ok) { setStatus('success'); setEmail(''); }
    else           { setStatus('error'); setErrorMsg(result.message || 'Could not subscribe. Please try again.'); }
  };

  if (status === 'success') {
    return (
      <div
        className="self-start flex items-center gap-2"
        style={{ color: 'var(--sage)', fontFamily: 'var(--font-body)' }}
        role="status"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-xs uppercase" style={{ letterSpacing: '0.18em', fontWeight: 600 }}>
          You’re on the list — we’ll email when lease is live.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="self-start w-full max-w-sm flex flex-col gap-2">
      <label htmlFor="lease-notify-email" className="sr-only">Email for lease launch notification</label>
      <div className="flex gap-2">
        <input
          id="lease-notify-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'invalid' || status === 'error') setStatus('idle'); }}
          placeholder="you@example.com"
          required
          aria-invalid={status === 'invalid' || status === 'error'}
          aria-describedby={status === 'invalid' || status === 'error' ? 'lease-notify-error' : undefined}
          className="flex-1 px-4 py-3 text-xs bg-transparent outline-none transition-colors duration-300"
          style={{
            border: status === 'invalid' || status === 'error'
              ? '1px solid var(--color-error)'
              : '1px solid var(--border-sage-strong)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            letterSpacing: '0.04em',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = (status === 'invalid' || status === 'error') ? 'var(--color-error)' : 'var(--border-gold-strong)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = (status === 'invalid' || status === 'error') ? 'var(--color-error)' : 'var(--border-sage-strong)'; }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="aerova-btn"
          style={{
            minWidth: 'auto',
            padding: '0 24px',
            opacity: status === 'loading' ? 0.6 : 1,
            cursor: status === 'loading' ? 'wait' : 'pointer',
          }}
        >
          {status === 'loading' ? 'Saving…' : 'Notify Me'}
        </button>
      </div>
      <p className="text-[10px]" style={{ color: 'var(--text-sub)', fontWeight: 400, letterSpacing: '0.04em', opacity: 0.6 }}>
        We’ll email when the $89/mo lease is live. No spam, unsubscribe anytime.
      </p>
      {(status === 'invalid' || status === 'error') && (
        <p id="lease-notify-error" role="alert" className="text-[11px] flex items-center gap-1.5"
           style={{ color: 'var(--color-error)', letterSpacing: '0.04em' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {status === 'invalid' ? 'Please enter a valid email address.' : errorMsg}
        </p>
      )}
    </form>
  );
}
