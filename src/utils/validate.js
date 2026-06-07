/**
 * Shared email validator, used in ContactPage and Footer.
 * Matches RFC-5321 simplified pattern.
 */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
