"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/StoreContext";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Your Vault</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Your vault is empty</p>
                    <p className="text-muted-foreground text-sm">Add some status items to start.</p>
                  </div>
                  <button onClick={onClose} className="px-6 py-3 bg-white text-black font-bold rounded-xl mt-4">
                    START SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white/10 text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-[10px] font-black text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white/10 text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-primary font-black">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-white">₹{cartTotal}</span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                  Taxes and shipping calculated at checkout
                </p>
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="w-full py-4 bg-primary text-black font-black text-lg rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                >
                  CHECKOUT NOW <ArrowRight size={20} />
                </Link>
                <button onClick={clearCart} className="w-full py-2 text-xs text-muted-foreground hover:text-white transition-colors">
                  Clear All Items
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
