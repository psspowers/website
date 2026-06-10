import type { SupabaseClient } from '@supabase/supabase-js';
import SiteSettingsSection from './SiteSettingsSection';
import StatsSection from './StatsSection';
import MilestonesSection from './MilestonesSection';

export default function AboutTab({ supabase }: { supabase: SupabaseClient }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">About &amp; Homepage Content</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage homepage hero text, stats banner, and milestones timeline.</p>
      </div>
      <div className="border-b border-gray-200 mb-8" />
      <SiteSettingsSection supabase={supabase} />
      <div className="border-b border-gray-200 mb-8" />
      <StatsSection supabase={supabase} />
      <div className="border-b border-gray-200 mb-8" />
      <MilestonesSection supabase={supabase} />
    </div>
  );
}
