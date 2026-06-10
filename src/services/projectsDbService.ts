import type { Project } from '../data/projects/types';
import { supabase } from '../lib/supabase';

interface ProjectRow {
  id: string;
  name: string;
  capacity: string;
  type: string;
  status: string;
  cod: string;
  role: string;
  location: string;
  image_url: string | null;
  coordinates_lat: number;
  coordinates_lng: number;
  description: string | null;
  client: string | null;
  scope: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  co2_reduction: number | null;
  trees_equivalent: number | null;
  energy_savings: number | null;
  is_featured: boolean;
  featured_order: number;
  is_website_only: boolean;
  created_at: string;
}

export interface FeaturedProject {
  id: string;
  name: string;
  capacity: string;
  type: string;
  location: string;
  country: string;
  image: string;
  description: string;
  year: string;
  featured_order: number;
}

function rowToProject(row: ProjectRow): Project {
  return {
    name: row.name,
    capacity: row.capacity,
    type: row.type,
    status: row.status,
    cod: row.cod,
    role: row.role,
    location: row.location,
    image: row.image_url ?? '',
    coordinates: {
      lat: Number(row.coordinates_lat),
      lng: Number(row.coordinates_lng),
    },
    description: row.description ?? undefined,
    client: row.client ?? undefined,
    scope: row.scope.length > 0 ? row.scope : undefined,
    features: row.features.length > 0 ? row.features : undefined,
    challenges: row.challenges.length > 0 ? row.challenges : undefined,
    solutions: row.solutions.length > 0 ? row.solutions : undefined,
    results: row.results.length > 0 ? row.results : undefined,
    sustainability: (row.co2_reduction || row.trees_equivalent || row.energy_savings) ? {
      co2Reduction: row.co2_reduction ?? undefined,
      treesEquivalent: row.trees_equivalent ?? undefined,
      energySavings: row.energy_savings ?? undefined,
    } : undefined,
  };
}

function extractYear(cod: string): string {
  const m = cod.match(/\d{4}/);
  return m ? m[0] : '';
}

function extractCountry(location: string): string {
  const parts = location.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : location;
}

/** Public projects page — excludes is_website_only rows */
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_website_only', false)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return (data as ProjectRow[]).map(rowToProject);
}

/** Homepage featured grid — up to 8, ordered by featured_order */
export async function fetchFeaturedProjects(): Promise<FeaturedProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id,name,capacity,type,location,image_url,description,cod,featured_order')
    .eq('is_featured', true)
    .order('featured_order', { ascending: true })
    .limit(8);

  if (error) throw new Error(`Failed to fetch featured projects: ${error.message}`);

  return (data as Pick<ProjectRow, 'id' | 'name' | 'capacity' | 'type' | 'location' | 'image_url' | 'description' | 'cod' | 'featured_order'>[]).map(row => ({
    id: row.id,
    name: row.name,
    capacity: row.capacity,
    type: row.type,
    location: row.location,
    image: row.image_url ?? '',
    description: row.description ?? '',
    year: extractYear(row.cod),
    country: extractCountry(row.location),
    featured_order: row.featured_order,
  }));
}

/** All projects including is_website_only — used only for pipeline MW totals */
export async function fetchAllProjectsForMetrics(): Promise<{ capacity: string; location: string }[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('capacity, location');

  if (error) throw new Error(`Failed to fetch project metrics: ${error.message}`);
  return data as { capacity: string; location: string }[];
}
