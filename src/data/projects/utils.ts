import type { Project, FilterCriteria } from './types';
import { regions } from './regions';
import { validateCapacityValue } from './validation';

export function filterProjects(projects: Project[], filters: FilterCriteria): Project[] {
  return projects.filter(project => {
    const matchesType = !filters.type || project.type === filters.type;
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesRegion = !filters.region || isInRegion(project.location, filters.region);
    return matchesType && matchesStatus && matchesRegion;
  });
}

export function isInRegion(location: string, regionName: string): boolean {
  const region = regions[regionName];
  return region ? region.locations.includes(location) : false;
}

export function calculateTotalCapacity(projects: Project[]): number {
  return projects.reduce((sum, project) => {
    return sum + validateCapacityValue(project.capacity);
  }, 0);
}

export function getUniqueLocations(projects: Project[]): string[] {
  return [...new Set(projects.map(project => project.location))];
}

export function getProjectTypes(projects: Project[]): string[] {
  return [...new Set(projects.map(project => project.type))];
}