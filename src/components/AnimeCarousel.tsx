'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AnimeCard from './AnimeCard';
import { AnimeData } from '@/lib/api';

interface AnimeCarouselProps {
  title: string;
  animes: AnimeData[];
  onAnimeSelect?: (anime: AnimeData) => void;
  loading?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'trending' | 'featured';
  showViewAll?: boolean;
}

export default function AnimeCarousel({
  title,
  animes,
  onAnimeSelect,
  loading = false,
  cardSize = 'medium',
  variant = 'default',
  showViewAll = true
}: AnimeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    checkScrollButtons();
    
    const handleResize = () => {
      checkIfMobile();
      checkScrollButtons();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animes, checkScrollButtons]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current || isScrolling) return;

    setIsScrolling(true);
    const scrollAmount = isMobile 
      ? scrollRef.current.clientWidth * 0.9 
      : scrollRef.current.clientWidth * 0.8;
      
    const targetScrollLeft = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setIsScrolling(false);
      checkScrollButtons();
    }, 500);
  }, [isScrolling, isMobile, checkScrollButtons]);

  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      checkScrollButtons();
    }
  }, [isScrolling, checkScrollButtons]);

  const getCardSpacing = () => {
    switch (cardSize) {
      case 'small': return 'gap-2 sm:gap-3 md:gap-4';
      case 'medium': return 'gap-3 sm:gap-4 md:gap-6';
      case 'large': return 'gap-4 sm:gap-6 md:gap-8';
      default: return 'gap-3 sm:gap-4 md:gap-6';
    }
  };

  const getPadding = () => {
    return variant === 'featured' ? 'px-3 sm:px-4 lg:px-6 xl:px-8' : 'px-3 sm:px-4 lg:px-6 xl:px-8';
  };

  if (loading) {
    return (
      <section className={`section-padding ${getPadding()}`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-1 h-6 sm:h-8 bg-gray-600 rounded-full animate-pulse" />
            <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-600 rounded-lg animate-pulse" />
          </div>
          <div className="h-4 sm:h-6 w-16 sm:w-20 bg-gray-600 rounded-lg animate-pulse" />
        </div>
        
        <div className={`flex ${getCardSpacing()} overflow-hidden`}>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`flex-shrink-0 ${
                cardSize === 'small' ? 'w-24 sm:w-32 md:w-40 h-36 sm:h-48 md:h-56' :
                cardSize === 'medium' ? 'w-32 sm:w-40 md:w-48 lg:w-52 h-48 sm:h-56 md:h-72 lg:h-80' :
                'w-40 sm:w-48 md:w-56 lg:w-64 h-60 sm:h-72 md:h-80 lg:h-96'
              } bg-gray-800 rounded-lg sm:rounded-2xl loading-shimmer`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (!animes || animes.length === 0) {
    return (
      <section className={`section-padding ${getPadding()}`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-1 h-6 sm:h-8 bg-accent rounded-full" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight">{title}</h2>
          </div>
        </div>
        
        <div className="flex-center py-12 sm:py-16">
          <div className="text-center">
            <div className="text-4xl sm:text-6xl mb-4 opacity-20">📺</div>
            <p className="text-white/60 text-base sm:text-lg">No anime found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative group ${getPadding()}`}>
      <motion.div 
        className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <motion.div 
            className="w-1 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-accent to-accent-light rounded-full shadow-glow"
            initial={{ height: 0 }}
            whileInView={{ height: variant === 'featured' ? '2.5rem' : '2rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-white tracking-tight">
              {title}
            </h2>
            {variant === 'trending' && (
              <motion.p 
                className="text-accent text-xs sm:text-sm font-medium mt-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                🔥 Currently Popular
              </motion.p>
            )}
            {variant === 'featured' && (
              <motion.p 
                className="text-white/70 text-xs sm:text-sm font-medium mt-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                ⭐ Editor&apos;s Choice
              </motion.p>
            )}
          </div>
        </div>
        
        {showViewAll && (
          <motion.button 
            className="text-white/70 hover:text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-1 sm:space-x-2 group"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <span>View All</span>
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </motion.div>

      <div className="relative">
        <AnimatePresence>
          {canScrollLeft && !isMobile && (
            <motion.button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              onClick={() => scroll('left')}
              disabled={isScrolling}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Önceki animeler"
            >
              <FaChevronLeft className="text-lg" />
            </motion.button>
          )}

          {canScrollRight && !isMobile && (
            <motion.button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              onClick={() => scroll('right')}
              disabled={isScrolling}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Sonraki animeler"
            >
              <FaChevronRight className="text-lg" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div
          ref={scrollRef}
          className={`flex ${getCardSpacing()} overflow-x-auto scrollbar-hide pb-4 ${
            isMobile ? 'scroll-smooth snap-x snap-mandatory' : ''
          }`}
          onScroll={handleScroll}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {animes.map((anime, index) => (
            <motion.div
              key={anime.mal_id}
              className={isMobile ? 'snap-start' : ''}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: Math.min(index * 0.1, 1),
                ease: "easeOut"
              }}
            >
              <AnimeCard
                anime={anime}
                onSelect={onAnimeSelect}
                priority={index < 6}
                variant={variant}
              />
            </motion.div>
          ))}
        </motion.div>

        {isMobile && (animes.length > 3) && (
          <div className="flex justify-center mt-4 space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft || isScrolling}
              className={`p-2 rounded-full transition-colors ${
                canScrollLeft 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-white/10 text-white/50'
              }`}
              whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
              whileTap={{ scale: canScrollLeft ? 0.9 : 1 }}
            >
              <FaChevronLeft className="text-sm" />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              disabled={!canScrollRight || isScrolling}
              className={`p-2 rounded-full transition-colors ${
                canScrollRight 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-white/10 text-white/50'
              }`}
              whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
              whileTap={{ scale: canScrollRight ? 0.9 : 1 }}
            >
              <FaChevronRight className="text-sm" />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}