"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useStore } from "@/lib/StoreContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  expiryAt: string;
}

export const ProductCard = ({ id, name, price, image, expiryAt }: ProductCardProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { addToCart, toggleFavorite, favorites } = useStore();
  const isFavorite = favorites.includes(id);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiryAt).getTime() - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryAt]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (timeLeft === "EXPIRED") return;
    addToCart({ id, name, price, image });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  if (!isMounted) return <div className="aspect-[3/4] bg-white/5 animate-pulse rounded-[2.5rem]" />;

  return (
    <Link href={`/product/${id}`} className="block">
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="group relative flex flex-col bg-[#0A0A0A] rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 cursor-pointer shadow-2xl"
      >
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-3 md:translate-x-16 md:group-hover:translate-x-0 transition-transform duration-500 ease-out z-20">
            <button 
              onClick={handleFavorite}
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 backdrop-blur-xl rounded-full flex items-center justify-center transition-all border border-white/10",
                isFavorite ? "bg-red-500 text-white border-red-500" : "bg-black/40 text-white hover:bg-white hover:text-black"
              )}
            >
              <Heart size={18} className="md:w-5 md:h-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={handleAddToCart}
              className="w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
            >
              <ShoppingCart size={18} className="md:w-5 md:h-5" />
            </button>
          </div>

          {/* Timer Badge */}
          <motion.div 
            animate={timeLeft !== "EXPIRED" ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 glass-dark px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl flex items-center justify-between border border-white/10 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2">
              <Clock size={12} className={cn("text-primary md:w-[14px]", timeLeft === "EXPIRED" && "text-destructive")} />
              <span className={cn("text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase", timeLeft === "EXPIRED" ? "text-destructive" : "text-white/80")}>
                {timeLeft === "EXPIRED" ? "Sold Out" : "Ending In"}
              </span>
            </div>
            {timeLeft !== "EXPIRED" && (
              <span className="text-[10px] md:text-xs font-black text-white font-mono">{timeLeft}</span>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-8 relative z-10">
          <div className="flex justify-between items-start mb-2 md:mb-3">
            <h3 className="font-black text-xl md:text-2xl text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{name}</h3>
            <span className="text-xl md:text-2xl font-black text-primary">₹{price}</span>
          </div>
          <p className="text-[10px] md:text-xs text-white/40 font-bold uppercase tracking-widest mb-4 md:mb-6">
            Vault Collection • Limited Release
          </p>
          
          <button 
            disabled={timeLeft === "EXPIRED"}
            onClick={handleAddToCart}
            className="w-full py-4 md:py-5 bg-white text-black font-black text-[10px] md:text-sm rounded-xl md:rounded-2xl hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {timeLeft === "EXPIRED" ? "DE-LISTED" : "ADD TO VAULT"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
};
