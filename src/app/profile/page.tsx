"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail,
  ShieldCheck,
  Clock,
  ExternalLink
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/lib/StoreContext";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");
  
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("vogue_user_name");
    const savedPhone = localStorage.getItem("vogue_user_phone");
    
    if (savedName) setUsername(savedName);
    else if (session?.user?.name) setUsername(session.user.name);

    if (savedPhone) setPhone(savedPhone);
  }, [session]);

  const saveProfile = () => {
    localStorage.setItem("vogue_user_name", username);
    localStorage.setItem("vogue_user_phone", phone);
    setIsEditing(false);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <Navbar />
      
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row items-center gap-8 mb-16 p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl"
        >
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-2 border-primary/30 p-1 group-hover:border-primary transition-all duration-500">
              <img 
                src={session?.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"} 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{username || session?.user?.name || "Member"}</h1>
            <p className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4">Elite Status Member</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/40 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2"><Mail size={14} className="text-primary" /> {session?.user?.email}</span>
              <span className="flex items-center gap-2"><Phone size={14} className="text-primary" /> {phone || "Add Phone Number"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => signOut()}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-400/10 hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${activeTab === 'orders' ? 'bg-primary text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            <Package size={16} /> Order History ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${activeTab === 'settings' ? 'bg-primary text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            <Settings size={16} /> Account Settings
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "orders" ? (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex gap-6">
                        <div className="w-24 h-24 bg-black rounded-3xl overflow-hidden border border-white/5">
                          <img src={order.items[0]?.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{order.status}</span>
                            <span className="text-white/30 text-[10px] font-bold">#{order.id}</span>
                          </div>
                          <h3 className="text-xl font-black uppercase tracking-tight mb-1">{order.items[0]?.name}</h3>
                          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{order.date}</p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:items-end justify-between">
                        <p className="text-2xl font-black text-white mb-4">₹{order.total.toLocaleString()}</p>
                        <div className="flex gap-3">
                          {order.trackingId && (
                            <button className="px-6 py-3 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                              Track Order
                            </button>
                          )}
                          <Link href={`/product/${order.items[0]?.id}`} className="px-6 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                            View Item
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Simple Tracking Line for Active Orders */}
                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex justify-between text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                          <span className={order.status === 'pending' ? 'text-primary' : 'text-white'}>Confirmed</span>
                          <span className={order.status === 'processing' ? 'text-primary' : (order.status !== 'pending' ? 'text-white' : '')}>Processing</span>
                          <span className={order.status === 'shipped' ? 'text-primary' : ''}>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: order.status === 'pending' ? '25%' : order.status === 'processing' ? '50%' : order.status === 'shipped' ? '75%' : '100%' }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
                  <Package size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="text-white/30 font-bold uppercase tracking-[0.3em]">No orders placed yet</p>
                  <Link href="/" className="inline-block mt-6 text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Start Shopping</Link>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">Account Settings</h2>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Display Name</label>
                  <div className="flex gap-4">
                    <input 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Phone Number</label>
                  <div className="flex gap-4">
                    <input 
                      value={phone}
                      placeholder="+91 98765 43210"
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-10 py-4 bg-white text-black font-black text-[10px] rounded-2xl uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={saveProfile}
                        className="px-10 py-4 bg-primary text-black font-black text-[10px] rounded-2xl uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-10 py-4 bg-white/5 text-white font-black text-[10px] rounded-2xl uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" /> Security & Access
                </h3>
                <button className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest">Switch Account</span>
                  <ChevronRight size={16} className="text-white/30 group-hover:text-primary transition-all" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
