// Types
export interface Project {
  name: string;
  capacity: string;
  type: string;
  status: string;
  cod: string;
  role: string;
  location: string;
  image: string;
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

// Validation functions
export function validateProject(project: Project): boolean {
  try {
    if (!project.name || typeof project.name !== 'string') {
      console.error('Invalid project name:', project);
      return false;
    }

    if (!project.capacity || typeof project.capacity !== 'string') {
      console.error('Invalid capacity:', project);
      return false;
    }

    if (!project.type || typeof project.type !== 'string') {
      console.error('Invalid type:', project);
      return false;
    }

    if (!project.status || typeof project.status !== 'string') {
      console.error('Invalid status:', project);
      return false;
    }

    if (!project.location || typeof project.location !== 'string') {
      console.error('Invalid location:', project);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Project validation error:', error);
    return false;
  }
}

export function validateCapacityValue(capacity: string): number {
  try {
    // Skip non-MWp values
    if (!capacity.toLowerCase().includes('mwp')) {
      return 0;
    }
    // Extract numeric value, handling edge cases
    const matches = capacity.match(/(\d+(?:\.\d+)?)/);
    const numericValue = matches ? parseFloat(matches[0]) : 0;
    return isNaN(numericValue) ? 0 : numericValue;
  } catch (error) {
    console.error('Capacity validation error:', error);
    return 0;
  }
}

export function calculateFilteredMetrics(projects: Project[], filters: FilterCriteria): ProjectMetrics {
  try {
    const filteredProjects = filterProjects(projects, filters);
    
    const uniqueSites = new Set(filteredProjects.map(p => p.location));
    const uniqueTypes = new Set(filteredProjects.map(p => p.type));
    
    let totalCapacity = 0;
    filteredProjects.forEach(project => {
      const capacity = validateCapacityValue(project.capacity);
      if (!isNaN(capacity)) {
        totalCapacity += capacity;
      }
    });

    return {
      activeProjects: filteredProjects.length,
      totalCapacity: totalCapacity.toFixed(2),
      totalSites: uniqueSites.size,
      projectTypes: uniqueTypes.size
    };
  } catch (error) {
    console.error('Metrics calculation error:', error);
    return {
      activeProjects: 0,
      totalCapacity: '0.00',
      totalSites: 0,
      projectTypes: 0
    };
  }
}

function filterProjects(projects: Project[], filters: FilterCriteria): Project[] {
  try {
    return projects.filter(project => {
      const matchesType = !filters.type || project.type === filters.type;
      const matchesStatus = !filters.status || project.status === filters.status;
      const matchesRegion = !filters.region || isInRegion(project.location, filters.region);
      return matchesType && matchesStatus && matchesRegion;
    });
  } catch (error) {
    console.error('Project filtering error:', error);
    return [];
  }
}

function isInRegion(location: string, region: string): boolean {
  try {
    const regionMap: Record<string, readonly string[]> = {
      'Central Thailand': [
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
      'Southern Thailand': [
        'Phuket, Thailand',
        'Krabi, Thailand'
      ],
      'Eastern Thailand': [
        'Chonburi, Thailand',
        'Rayong, Thailand'
      ],
      'Northeastern Thailand': [
        'Udon Thani, Thailand',
        'Nong Khai, Thailand',
        'Si Sa Ket, Thailand',
        'Maha Sarakham, Thailand'
      ],
      'India': [
        'Punjab, India'
      ]
    };
    
    return region in regionMap ? regionMap[region].includes(location) : false;
  } catch (error) {
    console.error('Region validation error:', error);
    return false;
  }
}