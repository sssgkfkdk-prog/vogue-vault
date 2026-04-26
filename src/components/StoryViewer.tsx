"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  id: string;
  title: string;
  image: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StoryViewer = ({ stories, initialIndex, isOpen, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    const duration = 5000; // 5 seconds per story
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isOpen]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-30">
          {stories.map((_, index) => (
            <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ 
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <img src={currentStory.image} className="w-full h-full object-cover" alt="" />
            </div>
            <span className="text-white font-bold tracking-wide">{currentStory.title}</span>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Image Content */}
        <div className="relative w-full h-full max-w-md mx-auto overflow-hidden">
          <motion.img 
            key={currentStory.id}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={currentStory.image} 
            className="w-full h-full object-cover"
            alt={currentStory.title}
          />
          
          {/* Navigation Tap Zones */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 cursor-pointer" onClick={handlePrev} />
            <div className="flex-1 cursor-pointer" onClick={handleNext} />
          </div>
        </div>

        {/* Controls (Desktop) */}
        <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-10 pointer-events-none">
          <button 
            onClick={handlePrev}
            className={`p-4 bg-white/10 hover:bg-white/20 rounded-full text-white pointer-events-auto ${currentIndex === 0 ? 'opacity-0' : ''}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={handleNext}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white pointer-events-auto"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
