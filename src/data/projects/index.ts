import { projects } from './projects';
import { regions } from './regions';
import { validateProject, validateCapacityValue } from './validation';

// Validate and export projects
export const validatedProjects = projects.filter(validateProject);

// Extract unique filters
export const projectTypes = [...new Set(validatedProjects.map(project => project.type))];
export const projectStatuses = [...new Set(validatedProjects.map(project => project.status))];
export const projectRegions = regions;

// Calculate project metrics
export const projectMetrics = {
  activeProjects: validatedProjects.length,
  totalCapacity: validatedProjects.reduce((sum, project) => sum + validateCapacityValue(project.capacity), 0).toFixed(2),
  totalSites: new Set(validatedProjects.map(project => project.location)).size,
  projectTypes: projectTypes.length
};

// Sort projects by date
export const sortedProjects = [...validatedProjects].sort((a, b) => {
  const yearMatchA = a.cod.match(/\d{4}/);
  const yearMatchB = b.cod.match(/\d{4}/);
  
  if (!yearMatchA || !yearMatchB) return 0;
  
  const yearA = parseInt(yearMatchA[0]);
  const yearB = parseInt(yearMatchB[0]);
  
  if (yearA !== yearB) return yearB - yearA;
  
  const quarterMatchA = a.cod.match(/Q(\d)/);
  const quarterMatchB = b.cod.match(/Q(\d)/);
  
  if (!quarterMatchA || !quarterMatchB) return 0;
  
  return parseInt(quarterMatchB[1]) - parseInt(quarterMatchA[1]);
});