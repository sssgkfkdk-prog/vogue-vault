"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-[#050505]">
      <Navbar />
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black text-white mb-4 uppercase tracking-tighter"
        >
          {title}
        </motion.h1>
        <p className="text-muted-foreground text-lg uppercase tracking-[0.3em]">Coming Soon to the Vault</p>
        <div className="mt-8 w-24 h-1 bg-primary mx-auto rounded-full" />
      </div>
    </main>
  );
}
