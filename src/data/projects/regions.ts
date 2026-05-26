import type { Region } from './types';

export const regions: Record<string, Region> = {
  'Central Thailand': {
    name: 'Central Thailand',
    locations: [
      'Bangkok, Thailand',
      'Samut Prakan, Thailand',
      'Pathum Thani, Thailand',
      'Saraburi, Thailand',
      'Samut Sakhon, Thailand',
      'Ayutthaya, Thailand',
      'Chachoengsao, Thailand',
      'Prachinburi, Thailand',
      'Kanchanaburi, Thailand',
      'Suphan Buri, Thailand'
    ],
    description: 'Major industrial and commercial hub with high energy demand'
  },
  'Southern Thailand': {
    name: 'Southern Thailand',
    locations: [
      'Phuket, Thailand',
      'Krabi, Thailand'
    ],
    description: 'Tourism-focused region with growing renewable energy adoption'
  },
  'Eastern Thailand': {
    name: 'Eastern Thailand',
    locations: [
      'Chonburi, Thailand',
      'Rayong, Thailand'
    ],
    description: 'Industrial heartland and part of the Eastern Economic Corridor'
  },
  'Northeastern Thailand': {
    name: 'Northeastern Thailand',
    locations: [
      'Udon Thani, Thailand',
      'Nong Khai, Thailand',
      'Si Sa Ket, Thailand',
      'Maha Sarakham, Thailand'
    ],
    description: 'Agricultural region with significant solar potential'
  },
  'India': {
    name: 'India',
    locations: [
      'Punjab, India'
    ],
    description: 'Expanding market with strong renewable energy growth'
  }
};