'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes, FaPlus, FaHeart } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'added' | 'removed';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 4000,
    };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheck className="text-green-400 text-sm sm:text-base" />;
      case 'error':
        return <FaTimes className="text-red-400 text-sm sm:text-base" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-400 text-sm sm:text-base" />;
      case 'info':
        return <FaInfoCircle className="text-blue-400 text-sm sm:text-base" />;
      case 'added':
        return <FaPlus className="text-green-400 text-sm sm:text-base" />;
      case 'removed':
        return <FaHeart className="text-red-400 text-sm sm:text-base" />;
      default:
        return <FaInfoCircle className="text-blue-400 text-sm sm:text-base" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
      case 'added':
        return 'bg-green-600/90';
      case 'error':
      case 'removed':
        return 'bg-red-600/90';
      case 'warning':
        return 'bg-yellow-600/90';
      case 'info':
        return 'bg-blue-600/90';
      default:
        return 'bg-gray-600/90';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
      className={`${getBackgroundColor()} backdrop-blur-md rounded-lg shadow-lg border border-white/10 p-3 sm:p-4 w-full max-w-sm`}
    >
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs sm:text-sm font-medium leading-5 break-words">
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onRemove(toast.id);
              }}
              className="mt-1 sm:mt-2 text-xs text-white/80 hover:text-white underline transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-white/60 hover:text-white transition-colors p-1"
        >
          <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Convenience hooks for common toast types
export function useToastHelpers() {
  const { showToast } = useToast();

  const showSuccess = useCallback((message: string, action?: Toast['action']) => {
    showToast({ type: 'success', message, action });
  }, [showToast]);

  const showError = useCallback((message: string, action?: Toast['action']) => {
    showToast({ type: 'error', message, action });
  }, [showToast]);

  const showInfo = useCallback((message: string, action?: Toast['action']) => {
    showToast({ type: 'info', message, action });
  }, [showToast]);

  const showWarning = useCallback((message: string, action?: Toast['action']) => {
    showToast({ type: 'warning', message, action });
  }, [showToast]);

  const showAddedToList = useCallback((animeTitle: string, action?: Toast['action']) => {
    showToast({ 
      type: 'added', 
      message: `Added "${animeTitle}" to My List`, 
      action 
    });
  }, [showToast]);

  const showRemovedFromList = useCallback((animeTitle: string, action?: Toast['action']) => {
    showToast({ 
      type: 'removed', 
      message: `Removed "${animeTitle}" from My List`, 
      action 
    });
  }, [showToast]);

  const showAddedToContinueWatching = useCallback((animeTitle: string) => {
    showToast({ 
      type: 'added', 
      message: `Added "${animeTitle}" to Continue Watching` 
    });
  }, [showToast]);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showAddedToList,
    showRemovedFromList,
    showAddedToContinueWatching,
  };
} 