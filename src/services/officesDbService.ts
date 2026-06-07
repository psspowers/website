import { supabase } from '../lib/supabase';

export interface Office {
  country: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  coordinates: [number, number];
  showInList: boolean;
}

interface OfficeRow {
  id: string;
  country: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  coordinates_lat: number;
  coordinates_lng: number;
  show_in_list: boolean;
  created_at: string;
}

function rowToOffice(row: OfficeRow): Office {
  return {
    country: row.country,
    name: row.name,
    address: row.address,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    // Match original [lng, lat] tuple order expected by ContactMap
    coordinates: [Number(row.coordinates_lng), Number(row.coordinates_lat)],
    showInList: row.show_in_list,
  };
}

export async function fetchOffices(): Promise<Office[]> {
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch offices: ${error.message}`);
  return (data as OfficeRow[]).map(rowToOffice);
}
