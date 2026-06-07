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
  created_at: string;
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

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return (data as ProjectRow[]).map(rowToProject);
}
