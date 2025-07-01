export interface AnimeData {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  } | null;
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface AnimeResponse {
  data: AnimeData[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface SingleAnimeResponse {
  data: AnimeData;
}

export interface AnimeEpisode {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string | null;
  score: number | null;
  filler: boolean;
  recap: boolean;
  forum_url: string;
}

export interface AnimeEpisodesResponse {
  data: AnimeEpisode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

const BASE_URL = 'https://api.jikan.moe/v4';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 3;
  private readonly timeWindow = 1000;

  async request<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const waitTime = this.timeWindow - (now - this.requests[0]);
      await sleep(waitTime);
      return this.request(fn);
    }

    this.requests.push(now);
    return fn();
  }
}

const rateLimiter = new RateLimiter();

async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  return rateLimiter.request(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Aniflix/1.0',
          },
        });

        if (!response.ok) {
          if (response.status === 429 && i < retries - 1) {
            await sleep(2000 * (i + 1));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await sleep(1000 * (i + 1));
      }
    }
    throw new Error('Max retries reached');
  });
}

export async function getTopAnime(page = 1, limit = 25): Promise<AnimeResponse> {
  const url = `${BASE_URL}/top/anime?page=${page}&limit=${limit}`;
  return fetchWithRetry<AnimeResponse>(url);
}

export async function getSeasonalAnime(year?: number, season?: string): Promise<AnimeResponse> {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  
  const url = `${BASE_URL}/seasons/${year || currentYear}/${season || currentSeason}`;
  return fetchWithRetry<AnimeResponse>(url);
}

export async function getAnimeById(id: number): Promise<SingleAnimeResponse> {
  const url = `${BASE_URL}/anime/${id}`;
  return fetchWithRetry<SingleAnimeResponse>(url);
}

export async function getAnimeEpisodes(id: number, page = 1): Promise<AnimeEpisodesResponse> {
  const url = `${BASE_URL}/anime/${id}/episodes?page=${page}`;
  return fetchWithRetry<AnimeEpisodesResponse>(url);
}

export async function searchAnime(query: string, page = 1, limit = 25): Promise<AnimeResponse> {
  const encodedQuery = encodeURIComponent(query);
  const url = `${BASE_URL}/anime?q=${encodedQuery}&page=${page}&limit=${limit}&order_by=score&sort=desc`;
  return fetchWithRetry<AnimeResponse>(url);
}

export async function getAnimeByGenre(genreId: number, page = 1): Promise<AnimeResponse> {
  const url = `${BASE_URL}/anime?genres=${genreId}&page=${page}&order_by=score&sort=desc`;
  return fetchWithRetry<AnimeResponse>(url);
}

export async function getRandomAnime(): Promise<SingleAnimeResponse> {
  const url = `${BASE_URL}/random/anime`;
  return fetchWithRetry<SingleAnimeResponse>(url);
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'fall';
}

export const GENRES = {
  1: 'Action',
  2: 'Adventure',
  4: 'Comedy',
  8: 'Drama',
  10: 'Fantasy',
  14: 'Horror',
  18: 'Mecha',
  19: 'Music',
  22: 'Romance',
  24: 'Sci-Fi',
  30: 'Sports',
  36: 'Slice of Life',
  40: 'Psychological',
  41: 'Thriller',
} as const;

export type GenreId = keyof typeof GENRES; 