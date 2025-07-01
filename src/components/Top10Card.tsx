'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AnimeData } from '@/lib/api';
import { FaPlay, FaStar } from 'react-icons/fa';

interface Top10CardProps {
  anime: AnimeData;
  rank: number;
  onSelect?: (anime: AnimeData) => void;
  priority?: boolean;
}

export default function Top10Card({ 
  anime, 
  rank,
  onSelect, 
  priority = false
}: Top10CardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = useMemo(() => {
    if (imageError) {
      return `data:image/svg+xml,%3Csvg width='400' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;
    }
    return anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  }, [imageError, anime.images]);

  const getRankStyles = useMemo(() => {
    if (rank <= 3) {
      return {
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500'
      };
    } else if (rank <= 6) {
      return {
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500'
      };
    } else {
      return {
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500'
      };
    }
  }, [rank]);

  const handleClick = useCallback(() => {
    onSelect?.(anime);
  }, [anime, onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <motion.div
      className="relative group cursor-pointer w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-48 sm:h-52 md:h-56 lg:h-60 flex-shrink-0 p-1"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.15,
        ease: "easeOut"
      }}
      style={{ 
        transformOrigin: 'center center',
        contain: 'layout style paint'
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${anime.title} - ${rank}. sırada`}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-700/50 group-hover:shadow-2xl transition-shadow duration-300"
           style={{ contain: 'layout style paint' }}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 animate-pulse" />
        )}
        
        <div className="flex h-full overflow-hidden">
          <div className="relative w-12 sm:w-14 md:w-16 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
            <div className="relative text-center z-10 max-w-full overflow-hidden px-1">
              <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${getRankStyles.textColor} leading-none drop-shadow-lg truncate`}
                   style={{ 
                     textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                     filter: 'drop-shadow(0 0 8px currentColor)',
                     contain: 'layout style'
                   }}>
                {rank}
              </div>
            </div>
            <div className={`absolute inset-0 ${getRankStyles.bgColor} opacity-20 blur-lg`} />
          </div>

          <div className="relative w-20 sm:w-24 md:w-28 h-full flex-shrink-0 overflow-hidden">
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
              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
              style={{ contain: 'layout style' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </div>

          <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col justify-between min-w-0 overflow-hidden"
               style={{ contain: 'layout style' }}>
            <div className="flex-1 space-y-1 sm:space-y-2 min-w-0 overflow-hidden">
              <h3 className="font-bold text-white text-xs sm:text-sm md:text-base mb-1 leading-tight break-words min-w-0 overflow-hidden pr-1"
                  style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}>
                {anime.title_english || anime.title}
              </h3>
              
              {anime.score && (
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 min-w-0 overflow-hidden flex-wrap pr-1">
                  <div className="flex items-center space-x-1 bg-yellow-500/20 px-1.5 sm:px-2 py-1 rounded-full flex-shrink-0 border border-yellow-500/30">
                    <FaStar className="text-yellow-400 text-xs flex-shrink-0" />
                    <span className="text-yellow-300 text-xs font-bold whitespace-nowrap">
                      {anime.score.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-300 text-xs hidden sm:inline min-w-0 flex-shrink truncate">
                    {anime.scored_by && anime.scored_by > 1000 
                      ? `${Math.round(anime.scored_by / 1000)}k oy` 
                      : `${anime.scored_by} oy`
                    }
                  </span>
                </div>
              )}

              <div className="flex gap-1 mb-1 sm:mb-2 overflow-hidden min-w-0 pr-1">
                <span className="bg-white/10 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded font-medium backdrop-blur-sm flex-shrink-0 sm:hidden truncate max-w-full border border-white/20">
                  {anime.genres?.[0]?.name}
                </span>
                <div className="hidden sm:flex gap-1 flex-wrap overflow-hidden min-w-0">
                  {anime.genres?.slice(0, 2).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="bg-white/10 text-white text-xs px-1.5 py-0.5 rounded font-medium backdrop-blur-sm flex-shrink-0 truncate border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {anime.year && (
                <p className="text-xs text-gray-400 font-medium truncate min-w-0 overflow-hidden pr-1">
                  <span className="whitespace-nowrap">{anime.year}</span>
                  <span className="hidden sm:inline"> • {anime.type}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end mt-1 sm:mt-2 flex-shrink-0 overflow-hidden pr-1">
              {rank <= 3 && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex-shrink-0 max-w-full overflow-hidden border border-red-400/30">
                  <span className="flex-shrink-0">🔥</span>
                  <span className="hidden sm:inline whitespace-nowrap truncate">POPÜLER</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="absolute top-3 right-3 z-10 max-w-[calc(100%-2rem)] overflow-hidden">
          <div className={`${getRankStyles.bgColor} ${getRankStyles.textColor} border ${getRankStyles.borderColor} text-xs px-2 py-1 rounded-full font-bold backdrop-blur-sm shadow-md whitespace-nowrap truncate max-w-full`}>
            TOP {rank}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
} 