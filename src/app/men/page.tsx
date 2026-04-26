"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function MenPage() {
  const router = useRouter();
  const { siteContent } = useStore();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"price-low" | "price-high" | "name-az" | "name-za" | "newest">("newest");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const categoryName = "Men";
  
  let filteredProducts = siteContent.products.filter(p => {
    const pCat = p.category.toLowerCase();
    return pCat.includes("men");
  });

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-az") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-za") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.expiryAt).getTime() - new Date(a.expiryAt).getTime());
  }

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 relative overflow-hidden">
      <Navbar />

      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vault / {categoryName}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{filteredProducts.length} Items</span>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-xl"
            >
              <SlidersHorizontal size={14} /> Filter & Sort
            </button>
          </div>
        </div>

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
                        <button 
                          key={option.id}
                          onClick={() => { setSortBy(option.id as any); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${sortBy === option.id ? 'bg-primary border-primary text-black shadow-xl' : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'}`}
                        >
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

        <div className="relative mb-24 py-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-10 -left-10 text-[12vw] font-black text-white/[0.02] uppercase pointer-events-none">{categoryName}</motion.div>
          <div className="relative z-10 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-primary" />
              <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">Elite Series 2026</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-8xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.85]">{categoryName}<span className="text-primary">.</span></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs max-w-2xl leading-relaxed">Exclusive {categoryName} collection with advanced sorting and premium aesthetics.</motion.p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
                <ProductCard id={product.id} name={product.name} price={product.price} image={product.image} expiryAt={product.expiryAt} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-40 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">No Items Yet</h2>
          </div>
        )}
      </div>
    </main>
  );
}
