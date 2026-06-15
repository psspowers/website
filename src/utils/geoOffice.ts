import type { Office } from '../services/officesDbService';

// Countries routed to the Bangkok office when there is no exact match
const SEA_COUNTRY_CODES = new Set([
  'TH', 'MY', 'VN', 'PH', 'ID', 'MM', 'KH', 'LA', 'BN', 'TL', 'MO',
]);

/**
 * Returns the best-match office for the visitor's country using the
 * `x-nf-country` header that Netlify injects at the CDN edge.
 *
 * Priority:
 *   1. Exact country-code match (TH → Bangkok, IN → Gurgaon, SG → Singapore)
 *   2. SE-Asia countries with no office → Bangkok
 *   3. Everyone else → Singapore
 */
export function detectOffice(headers: Headers, offices: Office[]): Office {
  if (offices.length === 0) return { country: '', name: '', address: '', coordinates: [0, 0], showInList: false };

  const visitorCountry = (headers.get('x-nf-country') ?? '').toUpperCase();

  if (visitorCountry) {
    const exact = offices.find(o => o.countryCode?.toUpperCase() === visitorCountry);
    if (exact) return exact;

    if (SEA_COUNTRY_CODES.has(visitorCountry)) {
      const bangkok = offices.find(o => o.countryCode?.toUpperCase() === 'TH');
      if (bangkok) return bangkok;
    }
  }

  return offices.find(o => o.countryCode?.toUpperCase() === 'SG') ?? offices[0];
}
