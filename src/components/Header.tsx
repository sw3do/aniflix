'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBars, FaTimes, FaClock, FaFire } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSearchHistory, addToSearchHistory } from '@/lib/localStorage';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function Header({ onSearch, searchQuery = '' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto', 'Dragon Ball',
    'Death Note', 'My Hero Academia', 'Jujutsu Kaisen', 'Tokyo Ghoul', 'Bleach'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      addToSearchHistory(searchInput.trim());
      setSearchHistory(getSearchHistory());
      onSearch?.(searchInput.trim());
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setShowSearch(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    addToSearchHistory(suggestion);
    setSearchHistory(getSearchHistory());
    onSearch?.(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSearch(false);
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowSuggestions(true);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/trending', label: 'Trending' },
    { href: '/popular', label: 'Popular' },
    { href: '/genres', label: 'Genres' },
    { href: '/latest', label: 'Latest' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
            : 'bg-transparent'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <motion.div
              className="flex items-center space-x-4 sm:space-x-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                href="/"
                className={`text-accent text-xl sm:text-2xl lg:text-3xl font-black tracking-tight hover:text-accent-hover transition-all duration-300 transform hover:scale-105 ${
                  isMobileMenuOpen ? 'lg:block hidden' : 'block'
                }`}
              >
                <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                  ANIFLIX
                </span>
              </Link>

              <nav className="hidden lg:flex space-x-6 xl:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white/80 hover:text-white transition-all duration-300 relative group text-sm font-medium"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2 sm:space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="hidden md:block relative" ref={searchRef}>
                <AnimatePresence>
                  {showSearch ? (
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            placeholder="Search anime..."
                            className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-64 sm:w-80 transition-all duration-300"
                            autoFocus
                          />
                          <FaSearch className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSearch(false);
                            setShowSuggestions(false);
                          }}
                          className="ml-2 sm:ml-3 text-white/60 hover:text-white transition-colors"
                        >
                          <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </form>

                      <AnimatePresence>
                        {showSuggestions && (
                          <motion.div
                            className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {searchHistory.length > 0 && (
                              <div className="p-3 sm:p-4 border-b border-white/10">
                                <div className="flex items-center text-xs text-white/60 mb-2 sm:mb-3 px-2">
                                  <FaClock className="mr-2" />
                                  Recent Searches
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                  {searchHistory.slice(0, 5).map((term, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSuggestionClick(term)}
                                      className="w-full text-left px-2 sm:px-3 py-1 sm:py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      {term}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="p-3 sm:p-4">
                              <div className="flex items-center text-xs text-white/60 mb-2 sm:mb-3 px-2">
                                <FaFire className="mr-2" />
                                Popular Searches
                              </div>
                              <div className="space-y-1 sm:space-y-2">
                                {popularSearches.slice(0, 6).map((term, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(term)}
                                    className="w-full text-left px-2 sm:px-3 py-1 sm:py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => setShowSearch(true)}
                      className="p-2 sm:p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Arama"
                    >
                      <FaSearch className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <button
                className="p-2 sm:p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10 md:hidden"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Arama"
              >
                <FaSearch className="h-4 w-4" />
              </button>

              <motion.button
                className="lg:hidden relative p-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Menü"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaTimes className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaBars className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
            <div className="px-4 py-3">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    placeholder="Search anime..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    autoFocus
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm" />
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            <motion.div
              className="absolute top-0 left-0 w-80 max-w-[85vw] h-full bg-gray-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10">
                  <Link
                    href="/"
                    className="text-accent text-2xl font-black tracking-tight"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ANIFLIX
                  </Link>
                </div>
                
                <nav className="flex-1 p-6">
                  <div className="space-y-4">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="block text-white/80 hover:text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}