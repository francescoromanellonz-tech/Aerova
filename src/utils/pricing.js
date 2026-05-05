/**
 * pricing.js
 * AEROVA pricing helpers — VND first, USD secondary.
 *
 * VND_PER_USD is a fixed reference rate for display. Update periodically (or
 * fetch live from a Cloudflare Worker if exchange-rate accuracy becomes
 * important — currently the prices are themselves approximate so a fixed rate
 * is fine for marketing display).
 *
 * VAT inclusion: Vietnamese consumer hardware prices are typically displayed
 * VAT-included. PRICE_USD constants below are the VAT-inclusive consumer
 * price. If the worker collects VAT separately at checkout, adjust UI copy
 * to match.
 */

export const VND_PER_USD = 25400; // approx as of mid-2026; review quarterly

/** Canonical SKU prices in USD (VAT-included consumer price). */
export const PRICE_USD = {
  PURCHASE: 1500,
  LEASE_MONTHLY: 89,
};

const fmtUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const fmtVND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/** Format a USD amount as VND, e.g. 1500 → "₫38.100.000". */
export function vnd(usdAmount) {
  return fmtVND.format(Math.round(usdAmount * VND_PER_USD));
}

/** Format a USD amount as USD, e.g. 1500 → "$1,500". */
export function usd(usdAmount) {
  return fmtUSD.format(usdAmount);
}

/**
 * Two-line dual price string. VND primary, USD secondary.
 * Returns { primary, secondary } so callers can style each independently.
 */
export function dualPrice(usdAmount) {
  return {
    primary: vnd(usdAmount),
    secondary: usd(usdAmount),
  };
}

/** Convenience: dual price for the standard $1,500 outright purchase. */
export function purchasePrice() {
  return dualPrice(PRICE_USD.PURCHASE);
}

/** Convenience: dual price for the $89/month lease. */
export function leaseMonthly() {
  return dualPrice(PRICE_USD.LEASE_MONTHLY);
}

/**
 * Total Cost of Ownership comparison.
 * Given a household's typical bottled-water spend per month in USD, returns
 * payback months and 5-year savings.
 *
 * Conservative model: AEROVA running cost ~$0.03/L plus electricity ~$2/mo.
 * For TCO display we assume the running cost is offset by ~$5/mo electricity
 * + filter amortisation, so the saving is ~(bottled spend − $5).
 */
export function tco({ monthlyBottledUsd, purchaseUsd = PRICE_USD.PURCHASE }) {
  const RUNNING_COST_PER_MONTH = 5;
  const monthlySaving = Math.max(0, monthlyBottledUsd - RUNNING_COST_PER_MONTH);
  const paybackMonths = monthlySaving > 0 ? Math.ceil(purchaseUsd / monthlySaving) : Infinity;
  const fiveYearSaving = monthlySaving * 60 - purchaseUsd;
  return {
    monthlySaving,
    paybackMonths,
    fiveYearSavingUsd: fiveYearSaving,
    fiveYearSavingVnd: Math.round(fiveYearSaving * VND_PER_USD),
  };
}
