export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  stats: { value: number; label: string; format: string };
  success: { client: string; result: string };
}

export const services: Service[] = [
  {
    id: 'spd',
    title: 'Development and Financing',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    description: 'We provide comprehensive development and financing solutions for renewable energy projects, from initial concept to financial close.',
    features: ['Project Development', 'Project Financing', 'Project Management', 'Risk Assessment'],
    stats: { value: 550, label: 'Project Pipeline (MW)', format: 'MW' },
    success: { client: 'Multiple Projects', result: 'Successfully developed and financed over 100 MW of solar projects' }
  },
  {
    id: 'epc',
    title: 'Turnkey Solar PV EPC Services',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    description: 'End-to-end project execution from engineering and procurement to construction and commissioning.',
    features: ['Turnkey project delivery', 'Quality assurance', 'Project management', 'Safety compliance'],
    stats: { value: 450, label: 'Total Capacity Installed (MW)', format: 'MW' },
    success: { client: 'Industrial Manufacturing Plant', result: 'Completed 60MW project in 3 months from start of construction' }
  },
  {
    id: 'om',
    title: 'Operations & Maintenance',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    description: 'Comprehensive maintenance services to ensure optimal system performance and longevity.',
    features: ['Preventive maintenance', 'Performance monitoring', '24/7 emergency support', 'Condition assessment'],
    stats: { value: 99.9, label: 'System Availability (%)', format: '%' },
    success: { client: 'Power Distribution Company', result: 'Achieved zero downtime for critical systems' }
  },
  {
    id: 'retrofit',
    title: 'Retrofit & Repowering Upgrades',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    description: 'Modernization and repowering services to enhance system efficiency and capabilities.',
    features: ['Equipment modernization', 'System upgrades', 'Energy efficiency improvements', 'Technology integration'],
    stats: { value: 25, label: 'Average Efficiency Gain (%)', format: '%' },
    success: { client: 'Large Shopping Center', result: 'Reduced energy consumption by 40% through modernization' }
  }
];

export const certifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System certification demonstrating our commitment to consistently delivering products and services that meet customer and regulatory requirements. Our robust quality control processes ensure continuous improvement and customer satisfaction in everything we do.'
  }
];
