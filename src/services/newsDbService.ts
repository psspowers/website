import type { NewsItem } from '../data/news';
import { supabase } from '../lib/supabase';

interface NewsPostRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  source: string;
  source_url: string;
  image_url: string | null;
  image_alt: string | null;
  image_aspect_ratio: string;
  image_width: number;
  image_height: number;
  tags: string[];
  date: string;
  is_published: boolean;
  created_at: string;
}

function rowToNewsItem(row: NewsPostRow): NewsItem {
  return {
    title: row.title,
    date: row.date,
    summary: row.summary,
    source: row.source,
    sourceUrl: row.source_url,
    image: {
      url: row.image_url ?? '',
      alt: row.image_alt ?? '',
      aspectRatio: (row.image_aspect_ratio as '16:9' | '4:3' | '1:1'),
      width: row.image_width,
      height: row.image_height,
    },
    tags: row.tags,
  };
}

export async function fetchNewsItems(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as NewsPostRow[]).map(rowToNewsItem);
  } catch (e) {
    console.error('fetchNewsItems:', e);
    return [];
  }
}
