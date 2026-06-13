import type { Office } from '../services/officesDbService';

/**
 * Returns the best-match office for the visitor's country using the
 * `x-nf-country` header that Netlify injects at the CDN edge.
 * Falls back to the first office (Bangkok HQ) when no match is found
 * or when running outside Netlify (local dev).
 */
export function detectOffice(headers: Headers, offices: Office[]): Office {
  if (offices.length === 0) return { country: '', name: '', address: '', coordinates: [0, 0], showInList: false };

  const visitorCountry = headers.get('x-nf-country') ?? '';

  if (visitorCountry) {
    const match = offices.find(
      o => o.countryCode?.toUpperCase() === visitorCountry.toUpperCase()
    );
    if (match) return match;
  }

  return offices[0];
}
