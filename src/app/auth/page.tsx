"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Smartphone, 
  ShieldCheck, 
  Mail, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const [method, setMethod] = useState<"initial" | "phone" | "google">("initial");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setMethod("google");
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google Login Error:", error);
      setMethod("initial");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] animate-pulse delay-1000" />
      
      <Navbar />

      <Link href="/" className="fixed top-28 left-10 hidden lg:flex items-center gap-2 text-muted-foreground hover:text-white transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Gallery</span>
      </Link>

      <AnimatePresence mode="wait">
        {method === "initial" && (
          <motion.div 
            key="initial"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] text-center relative z-10"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_15px_30px_rgba(212,175,55,0.3)]">
              <ShieldCheck size={40} className="text-black" />
            </div>

            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Member Access</h1>
            <p className="text-muted-foreground text-sm mb-12">Unlock premium drops and early access.</p>

            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-5 bg-white text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                CONTINUE WITH GOOGLE
              </button>

              <button 
                onClick={() => setMethod("phone")}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              >
                <Smartphone size={18} />
                LOGIN WITH PHONE
              </button>
            </div>

            <p className="mt-12 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              By joining, you agree to our <span className="text-white">Elite Terms</span>
            </p>
          </motion.div>
        )}

        {method === "phone" && (
          <motion.div 
            key="phone"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl relative z-10"
          >
            <button onClick={() => setMethod("initial")} className="mb-8 p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all">
              <ArrowLeft size={18} />
            </button>

            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Phone Access</h2>
            <p className="text-muted-foreground text-sm mb-10">We'll send you a secure entry code.</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-5 text-white font-bold text-lg">
                    +91
                  </div>
                  <input 
                    autoFocus
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel" 
                    placeholder="98765 43210" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xl font-bold focus:border-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <button className="w-full py-5 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-[0_15px_30px_rgba(212,175,55,0.3)]">
                SEND ACCESS CODE <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {method === "google" && (
          <motion.div 
            key="google"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl text-center relative z-10"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
              {isLoading ? "Connecting Account" : "Redirecting..."}
            </h2>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1/2 h-full bg-primary"
              />
            </div>
            <p className="text-muted-foreground text-xs mt-6 uppercase tracking-widest font-bold">Verifying with Google Secure Service...</p>
            
            <button onClick={() => setMethod("initial")} className="mt-10 text-xs text-white/50 hover:text-white transition-all underline">
              Cancel Authorization
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
        Secured by Vogue Vault Security Layer v2.0
      </footer>
    </main>
  );
}
