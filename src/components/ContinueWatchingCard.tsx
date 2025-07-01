'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { WatchedAnime } from '@/lib/localStorage';
import { FaPlay, FaStar, FaCalendar, FaTimes } from 'react-icons/fa';

interface ContinueWatchingCardProps {
  anime: WatchedAnime;
  onSelect?: (anime: WatchedAnime) => void;
  onRemove?: (animeId: number) => void;
  priority?: boolean;
}

export default function ContinueWatchingCard({ 
  anime, 
  onSelect, 
  onRemove,
  priority = false
}: ContinueWatchingCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);

  const imageUrl = useMemo(() => {
    if (imageError) {
      return `data:image/svg+xml,%3Csvg width='400' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;
    }
    return anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  }, [imageError, anime.images]);

  const formatWatchedDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US');
    }
  }, []);

  const getNextEpisodeText = useCallback(() => {
    if (anime.progress >= 95) {
      return `Episode ${anime.currentEpisode + 1}`;
    }
    return `Episode ${anime.currentEpisode}`;
  }, [anime.progress, anime.currentEpisode]);

  const handleClick = useCallback(() => {
    onSelect?.(anime);
  }, [anime, onSelect]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(anime.mal_id);
  }, [anime.mal_id, onRemove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <motion.div
      className="relative group cursor-pointer w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-36 sm:h-40 md:h-44 flex-shrink-0"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
      tabIndex={0}
      role="button"
      aria-label={`Continue watching ${anime.title}`}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 animate-pulse" />
        )}
        
        <div className="flex h-full">
          <div className="relative w-24 sm:w-28 md:w-32 h-full flex-shrink-0">
            <Image
              src={imageUrl}
              alt={anime.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              priority={priority}
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
            />
          </div>

          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2">
                {anime.title_english || anime.title}
              </h3>
              
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">
                {anime.score && (
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400" />
                    <span>{anime.score.toFixed(1)}</span>
                  </div>
                )}
                
                {anime.year && (
                  <div className="flex items-center space-x-1">
                    <FaCalendar />
                    <span>{anime.year}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                Watched {formatWatchedDate(anime.watchedAt)}
              </p>

              <p className="text-sm sm:text-base text-accent font-medium mb-2">
                {getNextEpisodeText()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-300">
                <span>{Math.round(anime.progress)}% completed</span>
                {anime.episodes && (
                  <span className="hidden sm:inline">{anime.currentEpisode} / {anime.episodes}</span>
                )}
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${anime.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
            <FaPlay className="text-white text-lg sm:text-xl ml-1" />
          </div>
        </div>

        {showRemoveButton && onRemove && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200"
            aria-label="Remove from continue watching"
          >
            <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        )}

        <div className="absolute top-2 left-2">
          <span className="bg-accent text-white text-xs sm:text-sm px-2 py-1 rounded font-medium">
            Continue
          </span>
        </div>
      </div>
    </motion.div>
  );
} 