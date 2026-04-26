"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Upload, 
  X, 
  Wand2, 
  CheckCircle2, 
  ShoppingBag, 
  Image as ImageIcon, 
  Layout, 
  PlusCircle,
  Trash2,
  ChevronDown,
  ShieldCheck,
  Package,
  Sparkles,
  Truck,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useStore } from "@/lib/StoreContext";

export default function AdminDashboard() {
  const { 
    addProduct, removeProduct, removeProductSize,
    addStory, removeStory, 
    addBanner, removeBanner,
    orders, updateOrderStatus, shipOrder, cancelOrder,
    siteContent 
  } = useStore();

  const [mainTab, setMainTab] = useState<"upload" | "orders" | "inventory">("upload");
  const [uploadSubTab, setUploadSubTab] = useState<"product" | "story" | "banner">("product");
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const latestOrder = orders.find(o => o.status === 'pending');

  const [activeLimit, setActiveLimit] = useState(10);
  const [archiveLimit, setArchiveLimit] = useState(10);
  const [previousOrderCount, setPreviousOrderCount] = useState(-1);

  // Ask for Notification Permission
  React.useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Web Audio API Bell Sound
  const playBellSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Drop pitch
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5); // Fade out
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) {
      console.log('Audio API not supported', e);
    }
  };

  // Listen for new orders
  React.useEffect(() => {
    if (orders.length > 0) {
      if (previousOrderCount === -1) {
        // Initial load, just set the count
        setPreviousOrderCount(orders.length);
      } else if (orders.length > previousOrderCount) {
        // New order arrived
        setPreviousOrderCount(orders.length);
        const newOrder = orders[0];
        
        if (newOrder.status === 'pending') {
          playBellSound();
          
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Order Received! 🚨", {
              body: `Order #${newOrder.id} from ${newOrder.customerName} - ₹${newOrder.total}`,
              icon: '/icon.svg' // PWA Icon
            });
          }
        }
      }
    }
  }, [orders, previousOrderCount]);

  // Form States
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("men");
  const [pExpiry, setPExpiry] = useState("24"); // Hours
  const [pSizes, setPSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [sTitle, setSTitle] = useState("");
  const [bTitle, setBTitle] = useState("");
  const [bDesc, setBDesc] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAction = async (type: "product" | "story" | "banner") => {
    if (type === "product") {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + Number(pExpiry));
      
      addProduct({ 
        name: pName, 
        price: Number(pPrice), 
        category: pCategory, 
        image: previews[0] || "", 
        images: previews, 
        sizes: pSizes,
        expiryAt: expiryDate.toISOString()
      });
      setPName(""); setPPrice(""); setPCategory("men"); setPExpiry("24"); setPSizes(["S", "M", "L", "XL"]);
    } else if (type === "story") {
      addStory({ title: sTitle, image: previews[0] || "", images: previews });
      setSTitle("");
    } else if (type === "banner") {
      addBanner({ title: bTitle, subtitle: bDesc, image: previews[0] || "", buttonText: "EXPLORE DROPS" });
      setBTitle(""); setBDesc("");
    }
    setPreviews([]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const renderUploadMode = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 mb-4">
          <Upload size={32} className="text-primary" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">The Vault</h2>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Store Creation Terminal</p>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[2.5rem] max-w-md mx-auto mb-16">
        {(["product", "story", "banner"] as const).map((t) => (
          <button 
            key={t}
            onClick={() => { setUploadSubTab(t); setPreviews([]); }}
            className={`py-4 rounded-[2rem] transition-all uppercase font-black text-[9px] tracking-widest ${uploadSubTab === t ? 'bg-primary text-black shadow-xl scale-[1.02]' : 'text-white/20 hover:text-white/50'}`}
          >
            {t === 'product' ? 'Items' : t === 'story' ? 'Story' : 'Banner'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {uploadSubTab === "product" && (
          <motion.div key="p-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 text-center border-dashed">
               <input id="p-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {previews.map((img, i) => (
                     <div key={i} className="relative group">
                       <img src={img} className="aspect-square rounded-2xl object-cover w-full h-full" />
                       <button 
                         onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                         className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                       >
                         <X size={14} />
                       </button>
                     </div>
                   ))}
                   <div onClick={() => document.getElementById('p-upload')?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/10 hover:text-primary transition-colors cursor-pointer">
                     <PlusCircle size={32} />
                     <span className="mt-2 font-bold uppercase text-[8px]">Add Photos</span>
                   </div>
                </div>
            </div>
            <div className="space-y-6 bg-white/5 border border-white/10 rounded-[3rem] p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase px-4">Item Name</label>
                  <input value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Signature Tee" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-lg text-white outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase px-4">Price (₹)</label>
                  <input value={pPrice} onChange={e => setPPrice(e.target.value)} type="number" placeholder="2999" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-lg text-white outline-none focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase px-4">Category</label>
                  <select value={pCategory} onChange={e => setPCategory(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary appearance-none">
                    <option value="men">Men's Drop</option>
                    <option value="women">Women's Drop</option>
                    <option value="limited">Limited Edition</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase px-4">Drop Duration</label>
                  <select value={pExpiry} onChange={e => setPExpiry(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary appearance-none">
                    <option value="24">24 Hours (1 Day)</option>
                    <option value="48">48 Hours (2 Days)</option>
                    <option value="168">7 Days (1 Week)</option>
                    <option value="288">12 Days (Premium Drop)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase px-4">Available Sizes (Unique Stock)</label>
                <div className="grid grid-cols-5 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button key={s} onClick={() => setPSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} className={`py-4 rounded-xl font-black text-[10px] border transition-all ${pSizes.includes(s) ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => handleAction("product")} className="w-full py-6 bg-primary text-black font-black text-xl rounded-2xl shadow-2xl mt-4 hover:scale-[1.01] active:scale-95 transition-all italic">LAUNCH DROP</button>
            </div>
          </motion.div>
        )}
        
        {uploadSubTab === "story" && (
          <motion.div key="s-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl mx-auto space-y-8 pb-20">
             <div className="text-center space-y-2 mb-8">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Post High-End Story</h3>
               <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Visible for 24 hours</p>
             </div>
             <input value={sTitle} onChange={e => setSTitle(e.target.value)} placeholder="Story Hook..." className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-white outline-none focus:border-accent" />
             <div onClick={() => document.getElementById('s-upload')?.click()} className="aspect-[9/16] max-w-[300px] mx-auto rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center text-white/10 cursor-pointer overflow-hidden group hover:border-accent transition-all shadow-2xl">
                <input id="s-upload" type="file" className="hidden" onChange={handleFileChange} />
                {previews[0] ? <img src={previews[0]} className="w-full h-full object-cover" /> : <PlusCircle size={48} />}
             </div>
             <button onClick={() => handleAction("story")} className="w-full py-6 bg-white text-black font-black text-xl rounded-3xl shadow-xl italic hover:scale-[1.02] active:scale-95 transition-all">POST LIVE</button>
             
             <div className="pt-12 space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Manage Active Stories</p>
                <div className="grid grid-cols-1 gap-3">
                  {siteContent.stories.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                      <div className="flex items-center gap-4">
                        <img src={s.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <p className="font-bold text-white text-sm">{s.title}</p>
                      </div>
                      <button onClick={() => removeStory(s.id)} className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
        )}

        {uploadSubTab === "banner" && (
          <motion.div key="b-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div onClick={() => document.getElementById('b-upload')?.click()} className="aspect-video rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center text-white/10 cursor-pointer overflow-hidden hover:border-primary transition-all shadow-2xl">
                 <input id="b-upload" type="file" className="hidden" onChange={handleFileChange} />
                 {previews[0] ? <img src={previews[0]} className="w-full h-full object-cover" /> : <ImageIcon size={64} />}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-6">Slider Promotion</h3>
                <input value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="Banner Title" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary" />
                <textarea value={bDesc} onChange={e => setBDesc(e.target.value)} placeholder="Subtitle / Description" className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary resize-none" />
                <button onClick={() => handleAction("banner")} className="w-full py-6 bg-primary text-black font-black text-xl rounded-2xl shadow-xl italic hover:scale-[1.02] active:scale-95 transition-all">UPDATE MAIN SLIDER</button>
              </div>
            </div>

            <div className="pt-12 space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Banners</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {siteContent.banners.map(b => (
                    <div key={b.id} className="p-4 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col gap-4">
                      <img src={b.image} className="aspect-video w-full rounded-[2rem] object-cover" />
                      <div className="flex items-center justify-between px-2">
                        <p className="font-bold text-white truncate text-[11px] uppercase tracking-tighter">{b.title}</p>
                        <button onClick={() => removeBanner(b.id)} className="p-2 text-white/10 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderOrdersMode = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Orders", val: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length, icon: ShoppingBag, color: "text-green-400" },
            { label: "Pending", val: orders.filter(o => o.status === 'pending').length, icon: Package, color: "text-yellow-400" },
            { label: "Shipped", val: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: "text-blue-400" },
            { label: "Archive", val: orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length, icon: ShieldCheck, color: "text-purple-400" }
          ].map((st, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all border-dashed">
              <st.icon size={20} className={`${st.color} mb-4`} />
              <p className="text-3xl font-black text-white">{st.val}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{st.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Recent Orders</h3>
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">{orders.filter(o => o.status === 'pending').length} New Orders</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
               {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 ? (
                 <div className="p-20 text-center bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
                   <p className="text-white/20 font-black uppercase text-sm tracking-widest">No active orders</p>
                 </div>
               ) : (
                 <>
                   <div className="grid grid-cols-1 gap-4">
                     {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').slice(0, activeLimit).map(order => (
                       <div key={order.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 items-center group hover:border-white/20 transition-all shadow-xl">
                         {/* Thumbnail Preview */}
                         <div className="relative w-16 h-16 shrink-0 hidden md:block">
                           <img src={order.items[0]?.image} className="w-full h-full rounded-2xl object-cover border border-white/10" />
                           {order.items.length > 1 && (
                             <div className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-black">
                               +{order.items.length - 1}
                             </div>
                           )}
                         </div>
                         
                         {/* Order Info */}
                         <div className="flex-1 min-w-0 w-full text-center md:text-left">
                           <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                             <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{order.id}</span>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                               order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                               order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                               'bg-white/10 text-white/40'
                             }`}>{order.status}</span>
                           </div>
                           <p className="text-xl font-black text-white truncate uppercase tracking-tighter">{order.customerName}</p>
                           <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest truncate">{order.items.map((i: any) => i.name).join(', ')}</p>
                         </div>

                         {/* Price & Date */}
                         <div className="text-center md:text-right shrink-0">
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{order.date}</p>
                           <p className="text-2xl font-black text-white italic tracking-tighter">₹{order.total}</p>
                         </div>

                         {/* Action */}
                         <Link href={`/admin/order/${order.id}`} className="w-full md:w-auto px-8 py-4 bg-primary hover:scale-[1.02] text-black border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 text-center shadow-lg shadow-primary/20">
                           View Details
                         </Link>
                       </div>
                     ))}
                   </div>
                   {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > activeLimit && (
                     <button 
                       onClick={() => setActiveLimit(prev => prev + 10)}
                       className="w-full py-6 mt-4 bg-white/5 border border-white/10 rounded-[2.5rem] text-white/40 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all shadow-xl"
                     >
                       View More Orders
                     </button>
                   )}
                 </>
               )}
           </div>
        </div>

        {/* Order Archive Section */}
         <div className="pt-20 space-y-8 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-white/40 uppercase tracking-tighter italic">Order Archive & History</h3>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length} Records</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').slice(0, archiveLimit).map(order => (
                 <div key={order.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-white/5 transition-all">
                    <div className="flex-1 w-full text-center md:text-left">
                       <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${order.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                             {order.status}
                          </span>
                          <span className="text-white/20 text-[9px] font-bold uppercase">{order.id}</span>
                       </div>
                       <p className="text-white font-black uppercase tracking-tighter text-lg">{order.customerName}</p>
                    </div>
                    <div className="flex-1 text-center md:text-right shrink-0">
                       <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Final Amount</p>
                       <p className="text-2xl text-white font-black italic tracking-tighter">₹{order.total}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                      <button 
                         onClick={() => updateOrderStatus(order.id, 'pending')}
                         className="flex-1 md:flex-none px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-white/40 uppercase tracking-widest transition-all text-center"
                      >
                         Restore
                      </button>
                      <Link href={`/admin/order/${order.id}`} className="flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-center">
                         View
                      </Link>
                    </div>
                 </div>
               ))}
            </div>
            {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length > archiveLimit && (
              <button 
                onClick={() => setArchiveLimit(prev => prev + 20)}
                className="w-full py-5 mt-4 bg-white/5 border border-white/5 rounded-2xl text-white/20 font-black text-[9px] uppercase tracking-[0.3em] hover:text-white transition-all"
              >
                View More Records
              </button>
            )}
         </div>
    </div>
  );

  const renderInventoryMode = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Live Drops", val: siteContent.products.length, icon: Package, color: "text-primary" },
            { label: "Total Units", val: siteContent.products.reduce((acc, p) => acc + (p.sizes?.length || 0), 0), icon: ShieldCheck, color: "text-blue-400" },
            { label: "Out of Stock", val: siteContent.products.filter(p => !p.sizes || p.sizes.length === 0).length, icon: X, color: "text-red-400" }
          ].map((st, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all border-dashed">
              <st.icon size={20} className={`${st.color} mb-4`} />
              <p className="text-3xl font-black text-white">{st.val}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{st.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Live Inventory List</h3>
            <div className="relative w-72">
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search live stock..." className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-[10px] text-white outline-none focus:border-primary transition-all" />
              <Wand2 className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteContent.products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-white/20 transition-all shadow-2xl">
              <div className="p-8 flex items-center gap-6">
                <div className="relative">
                  <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white text-lg truncate uppercase tracking-tighter">{p.name}</p>
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[7px] font-black text-white/40 uppercase">{p.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-primary font-black tracking-widest">₹{p.price}</p>
                    <p className="text-[8px] text-white/20 font-bold uppercase">Exp: {new Date(p.expiryAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 space-y-6 mt-auto">
                 <div className="flex flex-wrap gap-2">
                   {p.sizes?.map((sz: string) => (
                     <div key={sz} className="flex items-center gap-3 pl-4 pr-1 py-1 bg-black/40 rounded-xl border border-white/5 hover:border-accent transition-all">
                        <span className="text-[10px] font-black text-white">{sz}</span>
                        <button onClick={() => removeProductSize(p.id, sz)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase hover:scale-105 active:scale-95 transition-all">Sold</button>
                     </div>
                   ))}
                   {(!p.sizes || p.sizes.length === 0) && (
                     <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">Sold Out / Reserved</p>
                   )}
                 </div>
                 <button onClick={() => removeProduct(p.id)} className="w-full py-4 border border-white/5 hover:bg-red-500 text-white/20 hover:text-white rounded-2xl text-[9px] font-black uppercase transition-all tracking-widest">Delist Permanent</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  return (
    <main className="min-h-screen bg-[#050505] pt-12 pb-32 px-6">
      <Navbar />

      {/* Live Order Pulse Bar */}
      <AnimatePresence>
        {latestOrder && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center relative">
                    <ShoppingBag size={20} className="text-primary" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-primary text-black text-[8px] font-black uppercase rounded-full tracking-widest">New Order</span>
                      <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{latestOrder.id}</span>
                    </div>
                    <p className="text-lg font-black text-white uppercase tracking-tighter">
                      {latestOrder.customerName} <span className="text-white/20 mx-2">|</span> 
                      <span className="text-primary italic"> ₹{latestOrder.total}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recent Activity</p>
                    <p className="text-xs font-bold text-white uppercase">{latestOrder.date}</p>
                  </div>
                  <Link 
                    href={`/admin/order/${latestOrder.id}`}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/50 hover:text-white transition-all border border-white/5"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Switcher Toggle */}
      <div className="flex justify-center mb-16">
        <div className="flex bg-white/5 border border-white/10 rounded-full p-2 w-full max-w-xl">
          {[
            { id: "upload", label: "Uploads", icon: Upload },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "inventory", label: "Stock Control", icon: ShieldCheck }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setMainTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${mainTab === tab.id ? "bg-white text-black shadow-2xl scale-[1.02]" : "text-white/30 hover:text-white/50"}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {mainTab === "upload" && (
            <motion.div key="upload-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {renderUploadMode()}
            </motion.div>
          )}
          {mainTab === "orders" && (
            <motion.div key="orders-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {renderOrdersMode()}
            </motion.div>
          )}
          {mainTab === "inventory" && (
            <motion.div key="inventory-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {renderInventoryMode()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-12 py-6 rounded-full font-black text-[10px] shadow-2xl z-[100] flex items-center gap-4 uppercase tracking-[0.3em] italic">
            <CheckCircle2 size={24} /> Mission Successful
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
