"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  Truck,
  CheckCircle2,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/StoreContext";
import { Navbar } from "@/components/Navbar";

export default function CheckoutPage() {
  const { cart, placeOrder } = useStore();
  const [step, setStep] = useState(0); // 0: Auth, 1: Shipping, 2: Payment, 3: Success
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderId, setOrderId] = useState("");

  const cartTotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const shipping = 150;
  const total = cartTotal + shipping;

  const handleCompleteOrder = () => {
    const id = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    placeOrder({ name, phone, address });
    setOrderId(id);
    setStep(3);
  };

  const renderSummary = () => (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sticky top-32 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
        <ShoppingBag className="text-primary" size={20} /> Your Order
      </h3>
      <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
              <img src={item.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm line-clamp-1">{item.name}</p>
              <p className="text-muted-foreground text-[10px] uppercase font-bold">Qty: {item.quantity || 1}</p>
            </div>
            <p className="text-white font-bold">₹{item.price * (item.quantity || 1)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-white font-bold">₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping Fee</span>
          <span className="text-white font-bold">₹{shipping}</span>
        </div>
        <div className="flex justify-between text-xl pt-4 border-t border-white/5 mt-4">
          <span className="text-white font-black">Grand Total</span>
          <span className="text-primary font-black">₹{total}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Return to Boutique</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-12">
            <header>
              <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Checkout</h1>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${step >= 0 ? 'border-primary bg-primary text-black' : 'border-white/20'}`}>1</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Identity</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10" />
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${step >= 1 ? 'border-primary bg-primary text-black' : 'border-white/20'}`}>2</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Shipping</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10" />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${step >= 2 ? 'border-primary bg-primary text-black' : 'border-white/20'}`}>3</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
                </div>
              </div>
            </header>

            {step === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 bg-white/5 border border-white/10 p-10 rounded-[3rem]"
              >
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Express Authentication</h2>
                  <p className="text-muted-foreground text-sm">Fill in your phone to continue</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-4">
                    <input 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-center text-xl font-bold focus:border-primary outline-none" 
                    />
                    <button onClick={() => setStep(1)} className="w-full py-5 bg-primary/10 border border-primary/30 text-primary font-black text-sm rounded-2xl hover:bg-primary/20 transition-all">
                      CONTINUE TO SHIPPING
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Contact Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Mobile Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between px-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shipping Address</label>
                  </div>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Flat No, Building Name, Street..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all h-32" />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-6 bg-primary text-black font-black text-lg rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(212,175,55,0.3)] uppercase tracking-tighter"
                >
                  Continue to Payment <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="p-6 bg-primary/10 border-2 border-primary rounded-3xl flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-tighter">UPI / Net Banking / Cards</p>
                        <p className="text-primary/70 text-[10px] font-bold uppercase tracking-widest">Instant Activation</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-primary" size={24} />
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between cursor-pointer hover:border-white/30 transition-all opacity-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-tighter">Cash on Delivery</p>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Temporarily Disabled</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck size={20} />
                    <p className="text-xs font-black uppercase tracking-widest">Secure Payment Gateway</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy. Your transaction is encrypted and secured.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-6 border border-white/20 text-white font-black text-lg rounded-2xl hover:bg-white/5 transition-all uppercase tracking-tighter"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleCompleteOrder}
                    className="flex-[2] py-6 bg-primary text-black font-black text-lg rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(212,175,55,0.3)] uppercase tracking-tighter"
                  >
                    Complete Order
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-5">
            {renderSummary()}
          </div>
        </div>
      </div>

      {/* Success Screen Overlay */}
      {step === 3 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#050505] z-[200] flex items-center justify-center p-6"
        >
          <div className="text-center space-y-8 max-w-lg">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Order Placed</h1>
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">ID: {orderId}</p>
            </div>
            <p className="text-white/40 leading-relaxed font-medium">
              Thank you for choosing Vogue Vault. Your luxury drop is being prepared. You will receive a confirmation call on <span className="text-white">{phone}</span> shortly.
            </p>
            <div className="pt-8">
              <Link href="/" className="px-12 py-5 bg-white text-black font-black rounded-2xl shadow-2xl hover:scale-105 transition-all block">
                RETURN TO STORE
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
