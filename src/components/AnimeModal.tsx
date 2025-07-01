'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AnimeData, AnimeEpisode, getAnimeEpisodes } from '@/lib/api';
import { FaTimes, FaPlay, FaStar, FaCalendar, FaClock, FaTv, FaExternalLinkAlt, FaPlus, FaCheck, FaUsers, FaHeart, FaBroadcastTower, FaIndustry, FaGlobeAmericas } from 'react-icons/fa';
import { addToMyList, removeFromMyList, isInMyList } from '@/lib/localStorage';
import { useToast } from './Toast';

interface AnimeModalProps {
  anime: AnimeData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AnimeModal({ anime, isOpen, onClose }: AnimeModalProps) {
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [inMyList, setInMyList] = useState(false);
  const { showToast } = useToast();

  const imageUrl = useMemo(() => {
    return anime?.images?.webp?.large_image_url || anime?.images?.jpg?.large_image_url || '';
  }, [anime?.images]);

  const displayedEpisodes = useMemo(() => {
    return showAllEpisodes ? episodes : episodes.slice(0, 8);
  }, [episodes, showAllEpisodes]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  }, []);

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString('tr-TR');
  }, []);

  const getAiredDuration = useCallback((anime: AnimeData) => {
    if (!anime.aired?.from) return null;
    
    const startDate = new Date(anime.aired.from);
    const endDate = anime.aired.to ? new Date(anime.aired.to) : new Date();
    
    const startStr = startDate.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (anime.status === 'Currently Airing') {
      return `${startStr} - Devam ediyor`;
    } else if (anime.aired.to) {
      const endStr = endDate.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return `${startStr} - ${endStr}`;
    }
    
    return startStr;
  }, []);

  useEffect(() => {
    if (anime && isOpen) {
      setInMyList(isInMyList(anime.mal_id));
      setLoadingEpisodes(true);
      getAnimeEpisodes(anime.mal_id)
        .then(response => {
          setEpisodes(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch episodes:', error);
        })
        .finally(() => {
          setLoadingEpisodes(false);
        });
    }
  }, [anime, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMyListToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!anime) return;

    if (inMyList) {
      removeFromMyList(anime.mal_id);
      setInMyList(false);
      showToast({ type: 'success', message: `${anime.title} removed from your list` });
    } else {
      addToMyList(anime);
      setInMyList(true);
      showToast({ type: 'success', message: `${anime.title} added to your list` });
    }
  }, [anime, inMyList, showToast]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  if (!anime) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="anime-modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />
          
          <motion.div
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[98vh] sm:max-h-[95vh] bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-2.5 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="text-sm sm:text-base" />
            </button>

            <div className="overflow-y-auto max-h-[98vh] sm:max-h-[95vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="relative h-[25vh] sm:h-[35vh] md:h-[45vh] min-h-48">
                <Image
                  src={imageUrl}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 1200px"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                  <div className="max-w-5xl">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                          <div className="w-1 h-3 sm:h-5 bg-accent rounded-full"></div>
                          <span className="text-accent font-semibold text-xs sm:text-sm tracking-wider uppercase">
                            Featured Anime
                          </span>
                        </div>
                        
                        <h1 id="anime-modal-title" className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight">
                          {anime.title_english || anime.title}
                        </h1>
                        
                        {anime.title_japanese && anime.title_japanese !== anime.title && (
                          <p className="text-xs sm:text-sm md:text-base text-gray-300">{anime.title_japanese}</p>
                        )}
                      </div>

                      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                        {anime.score && (
                          <div className="flex items-center space-x-1 sm:space-x-2 bg-yellow-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-yellow-500/30">
                            <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                            <span className="text-white font-semibold text-xs sm:text-sm">{anime.score.toFixed(1)}</span>
                            {anime.scored_by && (
                              <span className="text-yellow-300/70 text-xs hidden sm:inline">
                                ({formatNumber(anime.scored_by)})
                              </span>
                            )}
                          </div>
                        )}

                        {anime.year && (
                          <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                            <FaCalendar className="text-accent text-xs sm:text-sm" />
                            <span className="text-white font-medium text-xs sm:text-sm">{anime.year}</span>
                          </div>
                        )}

                        {anime.episodes && (
                          <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                            <FaTv className="text-accent text-xs sm:text-sm" />
                            <span className="text-white font-medium text-xs sm:text-sm">{anime.episodes} Episodes</span>
                          </div>
                        )}

                        {anime.rank && (
                          <div className="bg-accent/20 border border-accent/30 text-accent px-2 sm:px-3 py-1 rounded-full">
                            <span className="text-xs sm:text-sm font-semibold">#{anime.rank}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <motion.button
                          className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-black px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaPlay className="text-xs sm:text-sm" />
                          <span>Watch Now</span>
                        </motion.button>

                        <motion.button
                          onClick={handleMyListToggle}
                          className={`flex items-center justify-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                            inMyList
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {inMyList ? <FaCheck className="text-xs sm:text-sm" /> : <FaPlus className="text-xs sm:text-sm" />}
                          <span className="hidden xs:inline">{inMyList ? 'In List' : 'Add to List'}</span>
                          <span className="xs:hidden">{inMyList ? 'Added' : 'Add'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                  <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
                        <div className="flex items-center justify-center mb-2">
                          <FaUsers className="text-blue-400 text-lg sm:text-xl" />
                        </div>
                        <div className="text-white font-bold text-sm sm:text-lg">{formatNumber(anime.members)}</div>
                        <div className="text-gray-400 text-xs sm:text-sm">Members</div>
                      </div>
                      
                      {anime.favorites > 0 && (
                        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
                          <div className="flex items-center justify-center mb-2">
                            <FaHeart className="text-red-400 text-lg sm:text-xl" />
                          </div>
                          <div className="text-white font-bold text-sm sm:text-lg">{formatNumber(anime.favorites)}</div>
                          <div className="text-gray-400 text-xs sm:text-sm">Favorites</div>
                        </div>
                      )}
                      
                      {anime.popularity && (
                        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
                          <div className="flex items-center justify-center mb-2">
                            <FaStar className="text-yellow-400 text-lg sm:text-xl" />
                          </div>
                          <div className="text-white font-bold text-sm sm:text-lg">#{anime.popularity}</div>
                          <div className="text-gray-400 text-xs sm:text-sm">Popularity</div>
                        </div>
                      )}
                      
                      {anime.rank && (
                        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
                          <div className="flex items-center justify-center mb-2">
                            <FaTv className="text-accent text-lg sm:text-xl" />
                          </div>
                          <div className="text-white font-bold text-sm sm:text-lg">#{anime.rank}</div>
                          <div className="text-gray-400 text-xs sm:text-sm">Ranking</div>
                        </div>
                      )}
                    </div>

                    {anime.title_synonyms && anime.title_synonyms.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Alternative Names</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {anime.title_synonyms.map((title, index) => (
                            <span
                              key={index}
                              className="bg-gray-800/50 text-gray-300 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm border border-gray-700/50"
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {anime.broadcast?.string && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Broadcast Schedule</span>
                        </h3>
                        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <FaBroadcastTower className="text-green-400 text-base sm:text-lg" />
                            <span className="text-white font-medium text-sm sm:text-base">{anime.broadcast.string}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {anime.trailer?.youtube_id && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Official Trailer</span>
                        </h3>
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                          <iframe
                            src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                            title={`${anime.title} Trailer`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                    {anime.synopsis && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Story & Plot</span>
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                          {anime.synopsis}
                        </p>
                      </div>
                    )}

                    {anime.background && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Background Information</span>
                        </h3>
                        <p className="text-gray-300 leading-relaxed bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50 text-sm sm:text-base">
                          {anime.background}
                        </p>
                      </div>
                    )}

                    {episodes.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                            <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                            <span>Episodes</span>
                          </h3>
                          {episodes.length > 8 && (
                            <button
                              onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                              className="text-accent hover:text-accent-hover font-medium transition-colors px-2 sm:px-3 py-1 bg-accent/10 rounded hover:bg-accent/20 text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline">
                                {showAllEpisodes ? 'Show Less' : `Show All (${episodes.length})`}
                              </span>
                              <span className="sm:hidden">
                                {showAllEpisodes ? 'Less' : `All (${episodes.length})`}
                              </span>
                            </button>
                          )}
                        </div>
                        
                        {loadingEpisodes ? (
                          <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-10 sm:h-12 bg-gray-800 rounded animate-pulse" />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto scrollbar-thin">
                            {displayedEpisodes.map((episode) => (
                              <div
                                key={episode.mal_id}
                                className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-800/60 hover:bg-gray-700/60 rounded transition-colors cursor-pointer group"
                              >
                                <div className="flex-1 min-w-0 pr-2">
                                  <h4 className="font-medium text-white group-hover:text-accent transition-colors text-sm sm:text-base truncate">
                                    {episode.title}
                                  </h4>
                                  {episode.title_japanese && (
                                    <p className="text-xs sm:text-sm text-gray-400 truncate">{episode.title_japanese}</p>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm flex-shrink-0">
                                  {episode.score && (
                                    <div className="flex items-center space-x-1 bg-yellow-500/20 px-1.5 sm:px-2 py-0.5 rounded">
                                      <FaStar className="text-yellow-400 text-xs" />
                                      <span className="text-yellow-300">{episode.score.toFixed(1)}</span>
                                    </div>
                                  )}
                                  {episode.aired && (
                                    <span className="text-gray-400 text-xs sm:text-sm">{formatDate(episode.aired)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {anime.genres && anime.genres.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Genres</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {anime.genres.map((genre) => (
                            <span
                              key={genre.mal_id}
                              className="bg-accent/10 border border-accent/30 text-accent px-2 sm:px-3 py-1 rounded font-medium hover:bg-accent/20 transition-colors cursor-pointer text-xs sm:text-sm"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {anime.themes && anime.themes.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2">
                          <div className="w-1 h-4 sm:h-5 bg-accent rounded-full"></div>
                          <span>Themes</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {anime.themes.map((theme) => (
                            <span
                              key={theme.mal_id}
                              className="bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2 sm:px-3 py-1 rounded font-medium hover:bg-purple-500/20 transition-colors cursor-pointer text-xs sm:text-sm"
                            >
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center space-x-2">
                        <div className="w-1 h-3 sm:h-4 bg-accent rounded-full"></div>
                        <span>Detaylar</span>
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between py-1 border-b border-gray-700">
                          <span className="text-gray-400 text-xs sm:text-sm">Tür:</span>
                          <span className="text-white font-medium text-xs sm:text-sm">{anime.type}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-700">
                          <span className="text-gray-400 text-xs sm:text-sm">Durum:</span>
                          <span className={`font-medium text-xs sm:text-sm ${
                            anime.status === 'Currently Airing' ? 'text-green-400' : 'text-white'
                          }`}>
                            {anime.status === 'Currently Airing' ? 'Yayında' : 
                             anime.status === 'Finished Airing' ? 'Tamamlandı' : anime.status}
                          </span>
                        </div>
                        {anime.source && (
                          <div className="flex items-center justify-between py-1 border-b border-gray-700">
                            <span className="text-gray-400 text-xs sm:text-sm">Kaynak:</span>
                            <span className="text-white font-medium text-xs sm:text-sm">{anime.source}</span>
                          </div>
                        )}
                        {anime.duration && (
                          <div className="flex items-center justify-between py-1 border-b border-gray-700">
                            <span className="text-gray-400 text-xs sm:text-sm">Süre:</span>
                            <span className="text-white font-medium text-xs sm:text-sm">{anime.duration}</span>
                          </div>
                        )}
                        {anime.rating && (
                          <div className="flex items-center justify-between py-1 border-b border-gray-700">
                            <span className="text-gray-400 text-xs sm:text-sm">Yaş Sınırı:</span>
                            <span className="text-white font-medium text-xs sm:text-sm">{anime.rating}</span>
                          </div>
                        )}
                        {anime.season && (
                          <div className="flex items-center justify-between py-1 border-b border-gray-700">
                            <span className="text-gray-400 text-xs sm:text-sm">Sezon:</span>
                            <span className="text-white font-medium text-xs sm:text-sm">{anime.season} {anime.year}</span>
                          </div>
                        )}
                        {getAiredDuration(anime) && (
                          <div className="flex items-start justify-between py-1">
                            <span className="text-gray-400 text-xs sm:text-sm">Yayın:</span>
                            <span className="text-white font-medium text-right text-xs sm:text-sm max-w-[60%] leading-tight">{getAiredDuration(anime)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {anime.demographics && anime.demographics.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                          <div className="w-1 h-3 sm:h-4 bg-accent rounded-full"></div>
                          <span>Demografik</span>
                        </h3>
                        <div className="space-y-1">
                          {anime.demographics.map((demo) => (
                            <div key={demo.mal_id} className="text-gray-300 font-medium text-xs sm:text-sm">
                              {demo.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {anime.studios && anime.studios.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                          <div className="w-1 h-3 sm:h-4 bg-accent rounded-full"></div>
                          <span>Stüdyo{anime.studios.length > 1 ? 'lar' : ''}</span>
                        </h3>
                        <div className="space-y-1">
                          {anime.studios.map((studio) => (
                            <div key={studio.mal_id} className="text-gray-300 font-medium text-xs sm:text-sm">
                              {studio.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {anime.producers && anime.producers.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                          <div className="w-1 h-3 sm:h-4 bg-accent rounded-full"></div>
                          <span>Yapımcılar</span>
                        </h3>
                        <div className="space-y-1">
                          {anime.producers.slice(0, 5).map((producer) => (
                            <div key={producer.mal_id} className="text-gray-300 font-medium text-xs sm:text-sm">
                              {producer.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {anime.licensors && anime.licensors.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                          <div className="w-1 h-3 sm:h-4 bg-accent rounded-full"></div>
                          <span>Lisans Sahipleri</span>
                        </h3>
                        <div className="space-y-1">
                          {anime.licensors.map((licensor) => (
                            <div key={licensor.mal_id} className="text-gray-300 font-medium text-xs sm:text-sm">
                              {licensor.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 