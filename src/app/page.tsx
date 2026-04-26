"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { StoriesBar } from "@/components/StoriesBar";
import { ProductCard } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, SlidersHorizontal, X, Check } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/StoreContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const { siteContent } = useStore();
  const { banners, sections, products } = siteContent;
  const [isMounted, setIsMounted] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<"all" | "men" | "women" | "limited" | "accessories">("all");
  const [sortBy, setSortBy] = React.useState<"price-low" | "price-high" | "name-az" | "name-za" | "newest">("newest");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let displayProducts = [...products];
  
  if (activeCategory !== "all") {
    displayProducts = displayProducts.filter(p => p.category === activeCategory);
  }

  if (sortBy === "price-low") {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-az") {
    displayProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-za") {
    displayProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === "newest") {
    displayProducts.sort((a, b) => new Date(b.expiryAt).getTime() - new Date(a.expiryAt).getTime());
  }

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen pt-24 pb-12 relative overflow-hidden bg-[#050505]">
      <Navbar />
      
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-primary fill-primary" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">{sections.stories.title}</h2>
          </div>
          <StoriesBar />
        </motion.div>

        <motion.section initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative h-[480px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl group">
          <Swiper modules={[Autoplay, Pagination]} loop={banners.length > 1} pagination={{ clickable: true }} autoplay={{ delay: 4000, disableOnInteraction: false }} speed={1000} className="w-full h-full">
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative w-full h-full overflow-hidden">
                  <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={banner.image} className="w-full h-full object-cover brightness-[0.35]" alt={banner.title} />
                  <div className="absolute bottom-0 left-0 h-1.5 bg-white/10 w-full z-20">
                    <motion.div initial={{ width: "0%" }} whileInView={{ width: "100%" }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} className="h-full bg-primary shadow-[0_0_20px_rgba(212,175,55,1)]" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center px-16 text-left">
                    <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-primary font-black tracking-[0.4em] text-[10px] mb-4 uppercase">Exclusive Drop 2026</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: "spring" }} className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tighter uppercase">{banner.title}</motion.h1>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-sm md:text-lg text-white/60 mb-8 max-w-xl leading-relaxed font-medium">{banner.subtitle}</motion.p>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}>
                      <Link href="/new" className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-black w-fit hover:bg-primary hover:scale-105 active:scale-95 transition-all shadow-2xl group/btn">
                        {banner.buttonText} <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.section>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter leading-none">{sections.products.title}</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{sections.products.subtitle}</p>
            
            <div className="flex flex-wrap gap-2 mt-8">
              {(["all", "men", "women", "limited", "accessories"] as const).map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 text-white/30 hover:text-white border border-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
            >
              <SlidersHorizontal size={14} /> Sort
            </button>
            <Link href="/new" className="text-primary font-black hover:underline tracking-[0.3em] text-[10px] uppercase border-b border-primary/20 pb-1">{sections.products.viewAllText}</Link>
          </div>
        </motion.div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-screen w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-[101] p-10 flex flex-col shadow-2xl" >
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Filter & Sort</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                    <X size={24} className="text-white" />
                  </button>
                </div>
                <div className="space-y-10 flex-1 overflow-y-auto">
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Sort Collection</p>
                    <div className="space-y-2">
                      {[
                        { id: "newest", label: "Newest Arrivals" },
                        { id: "price-low", label: "Price: Low to High" },
                        { id: "price-high", label: "Price: High to Low" },
                        { id: "name-az", label: "Name: A to Z" },
                        { id: "name-za", label: "Name: Z to A" }
                      ].map((option) => (
                        <button key={option.id} onClick={() => { setSortBy(option.id as any); setIsFilterOpen(false); }} className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${sortBy === option.id ? 'bg-primary border-primary text-black shadow-xl' : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'}`}>
                          <span className="font-black text-[10px] uppercase tracking-[0.3em]">{option.label}</span>
                          {sortBy === option.id && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsFilterOpen(false)} className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary transition-all mt-10">Close</button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 30, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1 } }}>
              <ProductCard id={product.id} name={product.name} price={product.price} image={product.image} expiryAt={product.expiryAt} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </main>
  );
}
