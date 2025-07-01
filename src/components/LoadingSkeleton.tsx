'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
  );
}

export function AnimeCardSkeleton({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-32 sm:w-36 md:w-40 h-48 sm:h-52 md:h-56',
    medium: 'w-36 sm:w-44 md:w-48 lg:w-52 h-52 sm:h-64 md:h-72 lg:h-80',
    large: 'w-44 sm:w-52 md:w-56 lg:w-64 h-64 sm:h-76 md:h-84 lg:h-96'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} flex-shrink-0`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden aspect-poster">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2">
          <Skeleton className="h-3 sm:h-4 w-3/4" />
          <Skeleton className="h-2 sm:h-3 w-1/2" />
          <div className="flex space-x-1 sm:space-x-2">
            <Skeleton className="h-4 sm:h-6 w-12 sm:w-16 rounded-full" />
            <Skeleton className="h-4 sm:h-6 w-8 sm:w-12 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen overflow-hidden aspect-hero">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <Skeleton className="h-12 sm:h-16 w-full" />
            <Skeleton className="h-4 sm:h-6 w-3/4" />
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
              <Skeleton className="h-2 sm:h-3 w-8 sm:w-12" />
              <Skeleton className="h-2 sm:h-3 w-16 sm:w-20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 sm:h-6 w-12 sm:w-16 rounded-full" />
              <Skeleton className="h-4 sm:h-6 w-16 sm:w-20 rounded-full" />
              <Skeleton className="h-4 sm:h-6 w-10 sm:w-14 rounded-full" />
            </div>
            <Skeleton className="h-16 sm:h-20 w-full" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Skeleton className="h-10 sm:h-12 w-full sm:w-32 lg:w-40 rounded-lg" />
              <Skeleton className="h-10 sm:h-12 w-full sm:w-28 lg:w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarouselSkeleton({ cardSize = 'medium' }: { cardSize?: 'small' | 'medium' | 'large' }) {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
        <Skeleton className="h-4 sm:h-6 w-16 sm:w-20" />
      </div>
      <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-hidden">
        {[...Array(8)].map((_, index) => (
          <AnimeCardSkeleton key={index} size={cardSize} />
        ))}
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {[...Array(24)].map((_, index) => (
        <AnimeCardSkeleton key={index} size="small" />
      ))}
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] bg-card rounded-lg sm:rounded-xl overflow-hidden">
      <div className="relative h-48 sm:h-64 md:h-96">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2 sm:space-y-4">
          <Skeleton className="h-8 sm:h-10 md:h-12 w-3/4" />
          <Skeleton className="h-4 sm:h-6 w-1/2" />
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
            <Skeleton className="h-3 sm:h-4 w-8 sm:w-12" />
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div>
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 mb-2 sm:mb-3" />
              <Skeleton className="h-32 sm:h-48 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 mb-2 sm:mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-3/4" />
              </div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 mb-2 sm:mb-3" />
              <div className="space-y-2 sm:space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
                    <Skeleton className="h-2 sm:h-3 w-16 sm:w-20" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-4 sm:h-5 w-12 sm:w-16 mb-2 sm:mb-3" />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-5 sm:h-6 w-12 sm:w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 