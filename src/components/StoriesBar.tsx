"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

import { useStore } from "@/lib/StoreContext";
import { StoryViewer } from "./StoryViewer";

export const StoriesBar = () => {
  const { siteContent } = useStore();
  const { stories, sections } = siteContent;
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);

  return (
    <div className="w-full py-6">
      <Swiper
        slidesPerView="auto"
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper"
      >
        {sections.stories.showAddButton && (
          <SwiperSlide style={{ width: 'auto' }}>
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:border-primary transition-all">
                <Plus className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">Add Story</span>
            </div>
          </SwiperSlide>
        )}

        {stories.map((story, index) => (
          <SwiperSlide key={story.id} style={{ width: 'auto' }}>
            <motion.div 
              onClick={() => setActiveStoryIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-primary via-accent to-purple-500">
                <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-white">{story.title}</span>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <StoryViewer 
        stories={stories} 
        initialIndex={activeStoryIndex || 0} 
        isOpen={activeStoryIndex !== null} 
        onClose={() => setActiveStoryIndex(null)} 
      />
    </div>
  );
};

