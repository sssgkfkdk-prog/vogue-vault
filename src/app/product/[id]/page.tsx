"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useStore } from "@/lib/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { siteContent, addToCart, toggleFavorite, favorites } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ user: "", rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const found = siteContent.products.find(p => p.id === id);
    if (found) {
      setProduct({
        ...found,
        images: (found as any).images || [found.image, found.image, found.image],
        description: (found as any).description || "Premium status-driven streetwear crafted for the modern visionary.",
        materials: "100% Organic Cotton • Heavyweight 400GSM • Distressed Finish",
        about: "Part of our 2026 Vault Collection. This piece explores the intersection of cyberpunk aesthetics and luxury comfort.",
        reviews: [
          { id: 1, user: "Aaryan K.", rating: 5, comment: "Insane quality, definitely worth the wait!" },
          { id: 2, user: "Sneha S.", rating: 5, comment: "The fit is perfect. Looks even better in person." }
        ]
      });
      if (found.sizes && found.sizes.length > 0) {
        setSelectedSize(found.sizes[0]);
      }
    }
  }, [id, siteContent.products]);

  if (!product) return null;

  const isFav = favorites.includes(product.id);

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Gallery</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left: 3D Animated Image Slider */}
          <motion.div 
            initial={{ opacity: 0, rotateY: -20, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                className="aspect-[4/5] w-full"
              >
                {product.images.map((img: string, i: number) => (
                  <SwiperSlide key={i}>
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            {/* Floating Tag */}
            <div className="absolute -top-4 -right-4 bg-primary text-black font-black px-6 py-2 rounded-full rotate-12 shadow-xl z-10">
              LIMITED DROP
            </div>
          </motion.div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black mb-2 tracking-tighter uppercase"
              >
                {product.name}
              </motion.h1>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-primary">₹{product.price}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold">4.9 (128 reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Select Size</p>
              <div className="flex gap-3">
                {product.sizes.map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold transition-all ${selectedSize === size ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/40'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => addToCart(product, selectedSize)}
                className="flex-1 bg-primary text-black h-20 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
              >
                <ShoppingBag size={24} /> ADD TO BAG
              </button>
              <button 
                onClick={() => toggleFavorite(product.id)}
                className={`w-20 h-20 rounded-[2rem] border-2 flex items-center justify-center transition-all ${isFav ? 'bg-red-500 border-red-500 text-white' : 'border-white/10 hover:border-white/40'}`}
              >
                <Heart size={28} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                <ShieldCheck size={20} className="text-primary" />
                Prepaid Only
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                <RotateCcw size={20} className="text-primary" />
                No Returns
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Details Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-20 border-t border-white/10">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">About The Product</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.about}
            </p>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="font-bold mb-4 uppercase text-sm tracking-widest text-primary">Materials & Care</h3>
              <p className="text-white font-medium">{product.materials}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase tracking-tight">Real Reviews</h2>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.reviews.length + userReviews.length} Verified</span>
            </div>

            {/* Review Form */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
              <p className="text-sm font-black uppercase tracking-widest text-white/50">Write a Review</p>
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={24} 
                        fill={(hoverRating || newReview.rating) >= star ? "#D4AF37" : "none"} 
                        className={(hoverRating || newReview.rating) >= star ? "text-primary" : "text-white/20"} 
                      />
                    </button>
                  ))}
                </div>
                <input 
                  value={newReview.user}
                  onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                  placeholder="Your Name" 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all" 
                />
                <textarea 
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..." 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm h-24 focus:border-primary outline-none transition-all" 
                />
                <button 
                  onClick={() => {
                    if (!newReview.user || !newReview.comment) return;
                    setUserReviews([ { id: Date.now(), ...newReview, verified: true }, ...userReviews ]);
                    setNewReview({ user: "", rating: 5, comment: "" });
                  }}
                  className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary transition-all"
                >
                  Post Review
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {[...userReviews, ...product.reviews].map((rev: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={rev.id} 
                  className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-white/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white uppercase text-sm">{rev.user}</p>
                        <span className="text-[8px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-black uppercase tracking-tighter">Verified Reviewer</span>
                      </div>
                      <div className="flex gap-0.5 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-white/10"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-white/30 font-bold">JUST NOW</p>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed italic">"{rev.comment}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
