import type { Project } from './types';

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
    if (capacity.includes('Well')) {
      return 0;
    }
    const numericValue = parseFloat(capacity.replace(/[^\d.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  } catch (error) {
    console.error('Capacity validation error:', error);
    return 0;
  }
}