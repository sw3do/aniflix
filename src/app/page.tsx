'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AnimeCarousel from '@/components/AnimeCarousel';
import AnimeModal from '@/components/AnimeModal';
import { 
  AnimeData, 
  getTopAnime, 
  getSeasonalAnime, 
  getAnimeByGenre, 
  getRandomAnime 
} from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import ContinueWatchingCard from '@/components/ContinueWatchingCard';
import Top10Card from '@/components/Top10Card';
import { CarouselSkeleton } from '@/components/LoadingSkeleton';
import { getContinueWatching, getMyList, removeFromContinueWatching, WatchedAnime, FavoriteAnime, addToContinueWatching } from '@/lib/localStorage';
import { useToastHelpers } from '@/components/Toast';

export default function Home() {
  const [heroAnime, setHeroAnime] = useState<AnimeData | null>(null);
  const [topAnime, setTopAnime] = useState<AnimeData[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<AnimeData[]>([]);
  const [actionAnime, setActionAnime] = useState<AnimeData[]>([]);
  const [romanceAnime, setRomanceAnime] = useState<AnimeData[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [continueWatching, setContinueWatching] = useState<WatchedAnime[]>([]);
  const [myList, setMyList] = useState<FavoriteAnime[]>([]);
  const { showAddedToContinueWatching } = useToastHelpers();
  const [loading, setLoading] = useState({
    hero: true,
    top: true,
    seasonal: true,
    action: true,
    romance: true,
    continueWatching: true,
    myList: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          randomResponse,
          topResponse,
          seasonalResponse,
          actionResponse,
          romanceResponse
        ] = await Promise.allSettled([
          getRandomAnime(),
          getTopAnime(1, 20),
          getSeasonalAnime(),
          getAnimeByGenre(1, 1),
          getAnimeByGenre(22, 1)
        ]);

        if (randomResponse.status === 'fulfilled') {
          setHeroAnime(randomResponse.value.data);
          setLoading(prev => ({ ...prev, hero: false }));
        } else {
          setLoading(prev => ({ ...prev, hero: false }));
        }

        if (topResponse.status === 'fulfilled') {
          setTopAnime(topResponse.value.data);
          setLoading(prev => ({ ...prev, top: false }));
        } else {
          setLoading(prev => ({ ...prev, top: false }));
        }

        if (seasonalResponse.status === 'fulfilled') {
          setSeasonalAnime(seasonalResponse.value.data);
          setLoading(prev => ({ ...prev, seasonal: false }));
        } else {
          setLoading(prev => ({ ...prev, seasonal: false }));
        }

        if (actionResponse.status === 'fulfilled') {
          setActionAnime(actionResponse.value.data);
          setLoading(prev => ({ ...prev, action: false }));
        } else {
          setLoading(prev => ({ ...prev, action: false }));
        }

        if (romanceResponse.status === 'fulfilled') {
          setRomanceAnime(romanceResponse.value.data);
          setLoading(prev => ({ ...prev, romance: false }));
        } else {
          setLoading(prev => ({ ...prev, romance: false }));
        }

      } catch (error) {
        console.error('Failed to fetch anime data:', error);
        setLoading({
          hero: false,
          top: false,
          seasonal: false,
          action: false,
          romance: false,
          continueWatching: false,
          myList: false
        });
      }
    };

    const loadLocalData = async () => {
      try {
        const continuewatchingData = getContinueWatching();
        const myListData = getMyList();
        
        setContinueWatching(continuewatchingData);
        setMyList(myListData);
        
        setLoading(prev => ({ 
          ...prev, 
          continueWatching: false, 
          myList: false 
        }));
      } catch (error) {
        console.error('Failed to load local data:', error);
        setLoading(prev => ({ 
          ...prev, 
          continueWatching: false, 
          myList: false 
        }));
      }
    };

    fetchData();
    loadLocalData();
  }, []);

  const handleAnimeSelect = (anime: AnimeData) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  };

  const handleWatchAnime = (anime: AnimeData) => {
    const randomEpisode = Math.floor(Math.random() * (anime.episodes || 12)) + 1;
    const randomProgress = Math.floor(Math.random() * 80) + 10;
    
    addToContinueWatching(anime, randomEpisode, randomProgress);
    setContinueWatching(getContinueWatching());
    showAddedToContinueWatching(anime.title_english || anime.title);
  };

  const handleContinueWatchingSelect = (anime: WatchedAnime) => {
    handleWatchAnime(anime);
  };

  const handleRemoveFromContinueWatching = (animeId: number) => {
    removeFromContinueWatching(animeId);
    setContinueWatching(getContinueWatching());
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAnime(null);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main>
        <HeroSection
          anime={heroAnime}
          loading={loading.hero}
          onWatchNow={handleWatchAnime}
          onMoreInfo={handleAnimeSelect}
        />

        <motion.div 
          className="relative -mt-32 z-20 bg-gradient-to-b from-transparent via-background/80 to-background pt-32 pb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="container-responsive space-y-16 lg:space-y-20">
            {/* Continue Watching Section */}
            {continueWatching.length > 0 && (
              <section className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-1 h-8 bg-accent rounded-full"></div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Continue Watching</h2>
                  </div>
                  <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                    View All
                  </button>
                </div>
                {loading.continueWatching ? (
                  <CarouselSkeleton cardSize="medium" />
                ) : (
                  <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                    {continueWatching.slice(0, 8).map((anime) => (
                      <ContinueWatchingCard
                        key={anime.mal_id}
                        anime={anime}
                        onSelect={handleContinueWatchingSelect}
                        onRemove={handleRemoveFromContinueWatching}
                        priority={continueWatching.indexOf(anime) < 3}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* My List Section */}
            {myList.length > 0 && (
              <section className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-1 h-8 bg-accent rounded-full"></div>
                    <h2 className="text-3xl font-black text-white tracking-tight">My List</h2>
                  </div>
                  <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                    View All
                  </button>
                </div>
                                 {loading.myList ? (
                   <CarouselSkeleton cardSize="medium" />
                 ) : (
                   <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                     {myList.slice(0, 8).map((anime, index) => (
                       <motion.div
                         key={anime.mal_id}
                         initial={{ opacity: 0, x: 50 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ 
                           duration: 0.5, 
                           delay: index * 0.1,
                           ease: "easeOut"
                         }}
                       >
                         <AnimeCard
                           anime={anime}
                           onSelect={handleAnimeSelect}
                           priority={index < 4}
                         />
                       </motion.div>
                     ))}
                   </div>
                 )}
              </section>
            )}

            {/* Top 10 Section */}
            {topAnime.length >= 10 && (
              <section className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-xl">#</span>
                      </div>
                      <h2 className="text-4xl font-black text-white tracking-tight">
                        Top 10 Anime Today
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Updated daily</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 px-1">
                    {topAnime.slice(0, 10).map((anime, index) => (
                      <motion.div
                        key={anime.mal_id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          ease: "easeOut"
                        }}
                      >
                        <Top10Card
                          anime={anime}
                          rank={index + 1}
                          onSelect={handleAnimeSelect}
                          priority={index < 3}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Gradient fade on sides */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
                </div>
              </section>
            )}

            <AnimeCarousel
              title="Top Rated Anime"
              animes={topAnime}
              onAnimeSelect={handleAnimeSelect}
              loading={loading.top}
              showViewAll
              cardSize="medium"
              variant="featured"
            />

            <AnimeCarousel
              title="This Season"
              animes={seasonalAnime}
              onAnimeSelect={handleAnimeSelect}
              loading={loading.seasonal}
              showViewAll
              cardSize="medium"
              variant="default"
            />

            <AnimeCarousel
              title="Action & Adventure"
              animes={actionAnime}
              onAnimeSelect={handleAnimeSelect}
              loading={loading.action}
              showViewAll
              cardSize="small"
              variant="default"
            />

            <AnimeCarousel
              title="Romance"
              animes={romanceAnime}
              onAnimeSelect={handleAnimeSelect}
              loading={loading.romance}
              showViewAll
              cardSize="small"
              variant="default"
            />

            {topAnime.length > 10 && (
              <AnimeCarousel
                title="Trending Now"
                animes={topAnime.slice(10)}
                onAnimeSelect={handleAnimeSelect}
                loading={loading.top}
                cardSize="large"
                variant="trending"
              />
            )}

            {seasonalAnime.length > 10 && (
              <AnimeCarousel
                title="New Releases"
                animes={seasonalAnime.slice(10)}
                onAnimeSelect={handleAnimeSelect}
                loading={loading.seasonal}
                cardSize="medium"
                variant="default"
              />
            )}
          </div>
        </motion.div>
      </main>

      <footer className="relative bg-gradient-to-b from-background to-gray-950 border-t border-white/10 mt-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-light rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container-responsive py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-2 h-8 bg-gradient-to-b from-accent to-accent-light rounded-full shadow-glow"></div>
                <h3 className="gradient-text text-3xl font-black tracking-tight">ANIFLIX</h3>
              </motion.div>
              
              <motion.p 
                className="text-white/70 text-base leading-relaxed max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Your ultimate destination for streaming the best anime series and movies. 
                Discover new favorites and revisit classics in stunning 4K quality.
              </motion.p>
              
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <button className="btn-primary text-sm px-6 py-2">
                  Start Watching
                </button>
                <button className="btn-secondary text-sm px-6 py-2">
                  Learn More
                </button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-white font-bold mb-6 text-lg">Browse</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Trending</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Popular</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Latest</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Genres</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Top Rated</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="text-white font-bold mb-6 text-lg">Genres</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Action</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Adventure</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Romance</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Comedy</a></li>
                <li><a href="#" className="text-white/60 hover:text-accent transition-all duration-300 text-sm hover:translate-x-1 block">Drama</a></li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="border-t border-white/10 mt-12 pt-8 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-white/60 text-sm">
                © 2024 Aniflix. All rights reserved. Data provided by <span className="text-accent">Jikan API</span>.
              </p>
              <div className="flex items-center space-x-2 text-xs text-white/40">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-accent transition-colors duration-300 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors duration-300 hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors duration-300 hover:underline">
                Support
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors duration-300 hover:underline">
                API
              </a>
            </div>
          </motion.div>
        </div>
      </footer>

      <AnimeModal
        anime={selectedAnime}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
