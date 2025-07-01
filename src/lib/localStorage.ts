import { AnimeData } from './api';

export interface WatchedAnime extends AnimeData {
  watchedAt: string;
  progress: number; // 0-100 percentage
  currentEpisode: number;
  lastEpisodeWatched?: string;
}

export interface FavoriteAnime extends AnimeData {
  addedAt: string;
}

const CONTINUE_WATCHING_KEY = 'aniflix_continue_watching';
const MY_LIST_KEY = 'aniflix_my_list';
const RECENTLY_VIEWED_KEY = 'aniflix_recently_viewed';

// Continue Watching functionality
export function addToContinueWatching(anime: AnimeData, currentEpisode: number = 1, progress: number = 0): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getContinueWatching();
    const watchedAnime: WatchedAnime = {
      ...anime,
      watchedAt: new Date().toISOString(),
      progress,
      currentEpisode,
    };

    const filtered = existing.filter(item => item.mal_id !== anime.mal_id);
    const updated = [watchedAnime, ...filtered].slice(0, 20); // Keep only 20 most recent

    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to add to continue watching:', error);
  }
}

export function getContinueWatching(): WatchedAnime[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CONTINUE_WATCHING_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get continue watching:', error);
    return [];
  }
}

export function removeFromContinueWatching(animeId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getContinueWatching();
    const updated = existing.filter(item => item.mal_id !== animeId);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove from continue watching:', error);
  }
}

// My List functionality
export function addToMyList(anime: AnimeData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getMyList();
    const isAlreadyInList = existing.some(item => item.mal_id === anime.mal_id);
    
    if (!isAlreadyInList) {
      const favoriteAnime: FavoriteAnime = {
        ...anime,
        addedAt: new Date().toISOString(),
      };
      
      const updated = [favoriteAnime, ...existing];
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to add to my list:', error);
  }
}

export function removeFromMyList(animeId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getMyList();
    const updated = existing.filter(item => item.mal_id !== animeId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove from my list:', error);
  }
}

export function getMyList(): FavoriteAnime[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(MY_LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get my list:', error);
    return [];
  }
}

export function isInMyList(animeId: number): boolean {
  const myList = getMyList();
  return myList.some(item => item.mal_id === animeId);
}

// Recently Viewed functionality
export function addToRecentlyViewed(anime: AnimeData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter(item => item.mal_id !== anime.mal_id);
    const updated = [anime, ...filtered].slice(0, 50); // Keep only 50 most recent
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to add to recently viewed:', error);
  }
}

export function getRecentlyViewed(): AnimeData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get recently viewed:', error);
    return [];
  }
}

// Search history
const SEARCH_HISTORY_KEY = 'aniflix_search_history';

export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  try {
    const existing = getSearchHistory();
    const filtered = existing.filter(item => item.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 10); // Keep only 10 most recent
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to add to search history:', error);
  }
}

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get search history:', error);
    return [];
  }
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CONTINUE_WATCHING_KEY);
    localStorage.removeItem(MY_LIST_KEY);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
} 