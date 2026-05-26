export interface Project {
  name: string;
  capacity: string;
  type: string;
  status: string;
  cod: string;
  role: string;
  location: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  client?: string;
  scope?: string[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  sustainability?: {
    co2Reduction?: number;
    treesEquivalent?: number;
    energySavings?: number;
  };
}

export interface ProjectMetrics {
  activeProjects: number;
  totalCapacity: string;
  totalSites: number;
  projectTypes: number;
}

export interface FilterCriteria {
  type: string;
  status: string;
  region: string;
}

export interface Region {
  name: string;
  locations: string[];
  description?: string;
}