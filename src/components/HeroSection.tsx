'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AnimeData } from '@/lib/api';
import { FaPlay, FaInfoCircle, FaStar, FaCalendar, FaTv, FaChevronDown } from 'react-icons/fa';

interface HeroSectionProps {
  anime: AnimeData | null;
  onWatchNow?: (anime: AnimeData) => void;
  onMoreInfo?: (anime: AnimeData) => void;
  loading?: boolean;
}

export default function HeroSection({ 
  anime, 
  onWatchNow, 
  onMoreInfo, 
  loading = false 
}: HeroSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = useMemo(() => {
    return anime?.images?.webp?.large_image_url || anime?.images?.jpg?.large_image_url;
  }, [anime?.images]);

  const handleWatchNow = useCallback(() => {
    if (anime) onWatchNow?.(anime);
  }, [anime, onWatchNow]);

  const handleMoreInfo = useCallback(() => {
    if (anime) onMoreInfo?.(anime);
  }, [anime, onMoreInfo]);

  const handleScrollToContent = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setImageLoaded(false);
  }, [anime]);

  if (loading || !anime) {
    return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-gray-800 rounded animate-pulse w-32 sm:w-48" />
              <div className="h-12 sm:h-16 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-3 sm:h-4 bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-3 sm:h-4 bg-gray-800 rounded animate-pulse w-1/2" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="h-10 sm:h-12 w-full sm:w-32 bg-gray-800 rounded animate-pulse" />
              <div className="h-10 sm:h-12 w-full sm:w-32 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        {imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt={anime.title}
              fill
              className={`object-cover transition-all duration-1000 ease-out ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              priority
              onLoad={() => setImageLoaded(true)}
              sizes="100vw"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          </>
        )}
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-1 h-6 sm:h-8 lg:h-10 bg-accent rounded-full" />
                <div>
                  <span className="text-accent font-semibold text-xs sm:text-sm lg:text-base tracking-wider uppercase block">
                    Featured Anime
                  </span>
                  <span className="text-white/60 text-xs lg:text-sm">
                    Now Airing
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-tight tracking-tight">
                  {anime.title_english || anime.title}
                </h1>
                
                {anime.title_japanese && anime.title_japanese !== anime.title && (
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/80 font-light">
                    {anime.title_japanese}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
                {anime.score && (
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-yellow-500/20 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg border border-yellow-500/30">
                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    <span className="font-semibold text-white text-xs sm:text-sm">{anime.score.toFixed(1)}</span>
                  </div>
                )}
                
                {anime.year && (
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                    <FaCalendar className="text-accent text-xs sm:text-sm" />
                    <span className="text-white font-medium text-xs sm:text-sm">{anime.year}</span>
                  </div>
                )}
                
                {anime.episodes && (
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                    <FaTv className="text-accent text-xs sm:text-sm" />
                    <span className="text-white font-medium text-xs sm:text-sm">{anime.episodes} Episodes</span>
                  </div>
                )}

                {anime.rank && anime.rank <= 50 && (
                  <div className="bg-accent px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg">
                    <span className="text-white font-semibold text-xs sm:text-sm">#{anime.rank} TOP RANKED</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 sm:px-3 py-1 bg-accent/20 text-accent rounded-lg text-xs sm:text-sm font-medium border border-accent/30">
                  {anime.type}
                </span>
                
                {anime.status === 'Currently Airing' && (
                  <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium border border-green-500/30">
                    🔴 LIVE
                  </span>
                )}
                
                {anime.score && anime.score >= 9.0 && (
                  <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs sm:text-sm font-medium border border-purple-500/30">
                    ⭐ TOP RANKED
                  </span>
                )}
              </div>

              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {anime.genres.slice(0, 6).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-2 sm:px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs sm:text-sm font-medium border border-white/10 transition-colors cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {anime.synopsis && (
                <div className="max-w-3xl">
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed line-clamp-3">
                    {anime.synopsis}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2">
                <motion.button
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                  onClick={handleWatchNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaPlay className="text-xs sm:text-sm" />
                  <span>Watch Now</span>
                </motion.button>

                <motion.button
                  className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors border border-white/30 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                  onClick={handleMoreInfo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaInfoCircle className="text-xs sm:text-sm" />
                  <span>More Info</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-colors p-2"
        onClick={handleScrollToContent}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        whileHover={{ y: 5 }}
        aria-label="Scroll down"
      >
        <FaChevronDown className="text-lg sm:text-xl animate-bounce" />
      </motion.button>
    </div>
  );
} 