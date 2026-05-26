interface Project {
  name: string;
  capacity: string;
  type: string;
  status: string;
  cod: string;
  role: string;
  location: string;
  image: string;
}

export class ProjectMetricsService {
  private static instance: ProjectMetricsService;
  private projects: Project[] = [];

  private constructor() {}

  static getInstance(): ProjectMetricsService {
    if (!ProjectMetricsService.instance) {
      ProjectMetricsService.instance = new ProjectMetricsService();
    }
    return ProjectMetricsService.instance;
  }

  setProjects(projects: Project[]) {
    this.projects = projects;
  }

  getMetrics() {
    const activeProjects = this.projects.length;
    const totalCapacity = this.calculateTotalCapacity();
    const totalSites = this.getUniqueLocations();
    const projectTypes = this.getProjectTypes().length;
    
    return {
      activeProjects,
      totalCapacity,
      totalSites,
      projectTypes
    };
  }

  private calculateTotalCapacity(): number {
    return this.projects.reduce((sum, project) => {
      // Skip projects with "Well" in capacity
      if (project.capacity.includes('Well')) {
        return sum;
      }
      const capacityStr = project.capacity.replace(/[^\d.]/g, '');
      const capacity = parseFloat(capacityStr);
      return sum + (isNaN(capacity) ? 0 : capacity);
    }, 0);
  }

  private getUniqueLocations(): number {
    return new Set(this.projects.map(project => project.location)).size;
  }

  private getProjectTypes(): string[] {
    return [...new Set(this.projects.map(project => project.type))];
  }
}