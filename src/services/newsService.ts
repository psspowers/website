import type { NewsItem } from '../data/news';
import { newsItems } from '../data/news';

export class NewsService {
  private static instance: NewsService;
  private lastFetchTimestamp: number = 0;
  private readonly FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly PAGE_SIZE = 5;

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  public async getLatestNews(page: number = 1): Promise<{ news: NewsItem[]; hasMore: boolean }> {
    try {
      await this.refreshIfNeeded();
      
      const start = (page - 1) * this.PAGE_SIZE;
      const end = start + this.PAGE_SIZE;
      const sortedNews = [...newsItems].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return {
        news: sortedNews.slice(start, end),
        hasMore: end < sortedNews.length
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  }

  private async refreshIfNeeded(): Promise<void> {
    const currentTime = Date.now();
    if (currentTime - this.lastFetchTimestamp >= this.FETCH_INTERVAL) {
      try {
        // In a real application, you would fetch from an API here
        this.lastFetchTimestamp = currentTime;
      } catch (error) {
        console.error('Error refreshing news:', error);
        throw new Error('Failed to refresh news');
      }
    }
  }
}