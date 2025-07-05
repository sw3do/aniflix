'use client';

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AnimeData } from '@/lib/api';
import { FaPlay, FaStar, FaCalendar, FaPlus, FaCheck, FaEye } from 'react-icons/fa';
import { addToMyList, removeFromMyList, isInMyList, addToRecentlyViewed } from '@/lib/localStorage';

interface AnimeCardProps {
  anime: AnimeData;
  onSelect?: (anime: AnimeData) => void;
  priority?: boolean;
  variant?: 'default' | 'trending' | 'featured';
}

const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg width='400' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;

// Optimized base classes with better responsive design
const BASE_CLASSES = {
  container: "relative group cursor-pointer flex-shrink-0 p-2 w-40 h-60 xs:w-44 xs:h-66 sm:w-48 sm:h-72 md:w-52 md:h-78 lg:w-56 lg:h-84 xl:w-60 xl:h-90 2xl:w-64 2xl:h-96 3xl:w-72 3xl:h-[432px]",
  cardInner: "relative w-full h-full rounded-xl overflow-hidden bg-gray-800 shadow-lg transition-all duration-300 border border-gray-700/50 will-change-transform contain-layout",
  loadingSkeleton: "absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 loading-shimmer",
  overlay: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300",
  topBadges: "absolute top-2 left-2 right-2 flex justify-between items-start z-20 sm:top-3 sm:left-3 sm:right-3",
  scoreBar: "flex items-center space-x-1 bg-black/90 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg border border-yellow-500/40 shadow-lg backdrop-blur-sm",
  bottomContent: "absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white bg-gradient-to-t from-black/95 via-black/80 to-transparent",
  title: "font-bold text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 line-clamp-2 break-words leading-tight",
  metaData: "flex items-center flex-wrap gap-1 mb-1 sm:mb-2",
  genres: "flex flex-wrap gap-1 mb-2 sm:mb-3",
  playButton: "w-full flex items-center justify-center space-x-1 sm:space-x-2 bg-white text-black hover:bg-gray-100 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-150 shadow-lg",
  actionButtons: "flex space-x-1 sm:space-x-2",
  watchLaterButton: "flex-1 p-1.5 sm:p-2 rounded-lg bg-black/60 border border-white/30 hover:bg-white/20 text-white transition-colors duration-150 shadow-lg"
};

// CSS-only hover effects for better performance
const CSS_HOVER_STYLES = `
  .anime-card-hover {
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  
  @media (hover: hover) {
    .anime-card-hover:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    .anime-card-hover:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
  
  @media (min-width: 1920px) {
    .anime-card-hover:hover {
      transform: translateY(-12px) scale(1.03);
    }
  }
  
  .image-scale {
    transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  
  @media (hover: hover) {
    .group:hover .image-scale {
      transform: scale(1.1);
    }
  }
`;

interface OptimizedState {
  imageError: boolean;
  isLoaded: boolean;
  inMyList: boolean;
  showHoverContent: boolean;
}

function AnimeCard({ 
  anime, 
  onSelect, 
  priority = false
}: AnimeCardProps) {
  const [state, setState] = useState<OptimizedState>({
    imageError: false,
    isLoaded: false,
    inMyList: false,
    showHoverContent: false
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  // Memoized computed data
  const computedData = useMemo(() => {
    const displayTitle = anime.title_english || anime.title;
    const imageUrl = state.imageError ? FALLBACK_IMAGE : 
      (anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url);
    const scoreText = anime.score ? anime.score.toFixed(1) : null;
    const genresSliced = anime.genres?.slice(0, 2) || [];
    const processedGenres = genresSliced.map(genre => ({
      id: genre.mal_id,
      name: genre.name.length > 8 ? genre.name.slice(0, 8) + '...' : genre.name
    }));
    
    const showTopRank = anime.rank && anime.rank <= 10;
    const ariaLabel = `View ${displayTitle} anime details`;
    const playAriaLabel = `Watch ${displayTitle}`;
    
    return {
      displayTitle,
      imageUrl,
      scoreText,
      processedGenres,
      showTopRank,
      ariaLabel,
      playAriaLabel
    };
  }, [
    anime.title_english, 
    anime.title, 
    anime.images?.webp?.large_image_url, 
    anime.images?.jpg?.large_image_url,
    anime.score,
    anime.genres,
    anime.rank,
    state.imageError
  ]);

  // Memoized class names
  const classNames = useMemo(() => ({
    image: `object-cover image-scale transition-opacity duration-300 ${state.isLoaded ? 'opacity-100' : 'opacity-0'}`,
    myListButton: `flex-1 p-1.5 sm:p-2 rounded-lg text-xs transition-colors duration-150 shadow-lg ${
      state.inMyList 
        ? 'bg-accent text-white hover:bg-accent-hover border border-accent/50' 
        : 'bg-black/60 border border-white/30 hover:bg-white/20 text-white'
    }`,
    myListAriaLabel: state.inMyList ? 'Remove from list' : 'Add to list'
  }), [state.isLoaded, state.inMyList]);

  // Effects
  useEffect(() => {
    setState(prev => ({ ...prev, inMyList: isInMyList(anime.mal_id) }));
  }, [anime.mal_id]);

  // Optimized event handlers
  const handleClick = useCallback(() => {
    addToRecentlyViewed(anime);
    onSelect?.(anime);
  }, [anime, onSelect]);

  const handleMyListToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.inMyList) {
      removeFromMyList(anime.mal_id);
      setState(prev => ({ ...prev, inMyList: false }));
    } else {
      addToMyList(anime);
      setState(prev => ({ ...prev, inMyList: true }));
    }
  }, [anime, state.inMyList]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const updateState = useCallback((updates: Partial<OptimizedState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleImageLoad = useCallback(() => updateState({ isLoaded: true }), [updateState]);
  const handleImageError = useCallback(() => updateState({ imageError: true }), [updateState]);

  // Hover handlers with debouncing
  const showHoverContentWithDelay = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveredRef.current) {
        setState(prev => ({ ...prev, showHoverContent: true }));
      }
    }, 200);
  }, []);

  const hideHoverContentWithDelay = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, showHoverContent: false }));
    }, 100);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    showHoverContentWithDelay();
  }, [showHoverContentWithDelay]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    hideHoverContentWithDelay();
  }, [hideHoverContentWithDelay]);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  }, [handleClick]);

  const handleWatchLaterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Added to watch later list');
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Memoized static badges
  const StaticBadges = useMemo(() => ({
    score: computedData.scoreText ? (
      <div className={BASE_CLASSES.scoreBar}>
        <FaStar className="text-yellow-400 text-xs" />
        <span className="text-yellow-300 font-bold text-xs">{computedData.scoreText}</span>
      </div>
    ) : null,
    
    live: anime.airing ? (
      <div className="bg-red-500 text-white text-xs px-1.5 py-1 sm:px-2 rounded-md font-bold shadow-lg border border-red-400/50 backdrop-blur-sm">
        LIVE
      </div>
    ) : null,
    
    rank: computedData.showTopRank ? (
      <div className="bg-accent text-white text-xs px-1.5 py-1 sm:px-2 rounded-md font-bold shadow-lg border border-accent/50 backdrop-blur-sm">
        #{anime.rank}
      </div>
    ) : null,
    
    year: anime.year ? (
      <div className="flex items-center space-x-1 bg-white/20 px-1.5 py-1 sm:px-2 rounded-md border border-white/30 backdrop-blur-sm">
        <FaCalendar className="text-accent text-xs" />
        <span className="text-xs font-medium">{anime.year}</span>
      </div>
    ) : null,
    
    episodes: anime.episodes ? (
      <span className="bg-white/20 px-1.5 py-1 sm:px-2 rounded-md text-xs font-medium border border-white/30 backdrop-blur-sm">
        {anime.episodes} Ep
      </span>
    ) : null
  }), [computedData.scoreText, anime.airing, computedData.showTopRank, anime.rank, anime.year, anime.episodes]);

  // Memoized genres list
  const GenresList = useMemo(() => (
    computedData.processedGenres.map((genre) => (
      <span
        key={genre.id}
        className="bg-accent/30 text-accent text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md font-medium border border-accent/50 backdrop-blur-sm"
      >
        {genre.name}
      </span>
    ))
  ), [computedData.processedGenres]);

  // Memoized hover content
  const HoverContent = useMemo(() => (
    <div className="space-y-1 sm:space-y-2">
      <button
        className={BASE_CLASSES.playButton}
        onClick={handlePlayClick}
        aria-label={computedData.playAriaLabel}
      >
        <FaPlay className="text-xs" />
        <span>Watch</span>
      </button>
      
      <div className={BASE_CLASSES.actionButtons}>
        <button
          className={classNames.myListButton}
          onClick={handleMyListToggle}
          aria-label={classNames.myListAriaLabel}
        >
          {state.inMyList ? <FaCheck className="text-xs mx-auto" /> : <FaPlus className="text-xs mx-auto" />}
        </button>

        <button
          className={BASE_CLASSES.watchLaterButton}
          onClick={handleWatchLaterClick}
          aria-label="Watch later"
        >
          <FaEye className="text-xs mx-auto" />
        </button>
      </div>
    </div>
  ), [handlePlayClick, computedData.playAriaLabel, classNames.myListButton, classNames.myListAriaLabel, 
      handleMyListToggle, state.inMyList, handleWatchLaterClick]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_HOVER_STYLES }} />
      <div
        className={`${BASE_CLASSES.container} anime-card-hover`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        role="button"
        aria-label={computedData.ariaLabel}
      >
        <div className={BASE_CLASSES.cardInner}>
          {!state.isLoaded && <div className={BASE_CLASSES.loadingSkeleton} />}
          
          <Image
            src={computedData.imageUrl}
            alt={anime.title}
            fill
            className={classNames.image}
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(max-width: 480px) 160px, (max-width: 640px) 176px, (max-width: 768px) 192px, (max-width: 1024px) 208px, (max-width: 1280px) 224px, (max-width: 1920px) 240px, 288px"
          />

          <div className={BASE_CLASSES.overlay} />
          
          <div className={BASE_CLASSES.topBadges}>
            {StaticBadges.score}
            <div className="flex flex-col space-y-1">
              {StaticBadges.live}
              {StaticBadges.rank}
            </div>
          </div>

          <div className={BASE_CLASSES.bottomContent}>
            <h3 className={BASE_CLASSES.title}>{computedData.displayTitle}</h3>
            
            <div className={BASE_CLASSES.metaData}>
              {StaticBadges.year}
              {StaticBadges.episodes}
            </div>

            <div className={BASE_CLASSES.genres}>
              {GenresList}
            </div>

            {/* Desktop hover content */}
            <div className="hidden md:block">
              <AnimatePresence mode="wait">
                {state.showHoverContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {HoverContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile static content */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs">
                  {computedData.scoreText && (
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">{computedData.scoreText}</span>
                    </div>
                  )}
                  
                  {anime.year && (
                    <span className="text-white/90 font-medium">{anime.year}</span>
                  )}
                </div>
                
                <button
                  className="p-1.5 rounded-lg bg-white/95 text-black hover:bg-white transition-colors duration-150 shadow-lg"
                  onClick={handlePlayClick}
                >
                  <FaPlay className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(AnimeCard);