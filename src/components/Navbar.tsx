import React from "react";
import Link from "next/link";
import { ShoppingBag, User, Search, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

import { useStore } from "@/lib/StoreContext";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  const { cartCount, siteContent } = useStore();
  const { data: session } = useSession();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProducts = searchQuery 
    ? siteContent.products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const isAdmin = session?.user?.email && (
    session.user.email.toLowerCase().trim() === "sssgkfkdk@gmail.com" || 
    siteContent.admins?.some(e => e.toLowerCase().trim() === session.user?.email?.toLowerCase().trim())
  );

  return (
    <>
      <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter text-white shrink-0">
          VOGUE<span className="text-primary">VAULT</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-[10px] font-black text-white hover:text-primary transition-all tracking-[0.3em] uppercase">Boutique</Link>
          <Link href="/men" className="text-[10px] font-black text-white hover:text-primary transition-all tracking-[0.3em] uppercase">Men</Link>
          <Link href="/women" className="text-[10px] font-black text-white hover:text-primary transition-all tracking-[0.3em] uppercase">Women</Link>
          <Link href="/shoes" className="text-[10px] font-black text-white hover:text-primary transition-all tracking-[0.3em] uppercase">Shoes</Link>
          <Link href="/accessories" className="text-[10px] font-black text-white hover:text-primary transition-all tracking-[0.3em] uppercase">Accessories</Link>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors group"
        >
          <Search size={20} className="text-white group-hover:text-primary transition-colors" />
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors relative group"
        >
          <ShoppingBag size={20} className="text-white group-hover:text-primary transition-colors" />
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-4 h-4 bg-accent text-[10px] flex items-center justify-center rounded-full text-white font-bold"
            >
              {cartCount}
            </motion.span>
          )}
        </button>

        {session ? (
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
            >
              <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white">
                {session.user?.name?.split(' ')[0]}
              </span>
              <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden">
                {session.user?.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-black font-bold">
                    {session.user?.name?.[0]}
                  </div>
                )}
              </div>
            </button>
            
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-48 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl"
                >
                  <div className="p-3 border-b border-white/5 mb-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Signed in as</p>
                    <p className="text-xs font-bold text-white truncate mt-1">{session.user?.email}</p>
                  </div>
                  <Link 
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <User size={16} className="text-primary" /> My Profile
                  </Link>

                  {isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 p-3 text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link href="/auth" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <User size={20} className="text-white" />
          </Link>
        )}

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>
    </motion.nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Luxury Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl p-6 md:p-20"
          >
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
            >
              <X size={32} />
            </button>

            <div className="max-w-4xl mx-auto pt-20">
              <p className="text-primary font-black uppercase tracking-[0.4em] mb-6 text-sm text-center">Search Boutique</p>
              <input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text" 
                placeholder="TYPE TO DISCOVER..." 
                className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-7xl font-black text-white outline-none focus:border-primary transition-all uppercase tracking-tighter py-8"
              />

              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map((p) => (
                  <Link 
                    key={p.id} 
                    href={`/product/${p.id}`}
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-6 p-4 bg-white/5 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl uppercase tracking-tight">{p.name}</h3>
                      <p className="text-primary font-bold text-sm">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
                
                {searchQuery && filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-white/30 font-bold text-2xl uppercase tracking-widest italic">No matches found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-4/5 max-w-sm bg-[#050505] border-r border-white/10 z-[101] p-8 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-bold tracking-tighter text-white">
                  VOGUE<span className="text-primary">VAULT</span>
                </span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={24} className="text-white" />
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { name: "Boutique", href: "/" },
                  { name: "Men", href: "/men" },
                  { name: "Women", href: "/women" },
                  { name: "Shoes", href: "/shoes" },
                  { name: "Accessories", href: "/accessories" }
                ].map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-2xl font-black text-white hover:text-primary transition-all uppercase tracking-tighter"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10 border-t border-white/5">
                {session ? (
                  <div className="space-y-4">
                    <Link 
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <img src={session.user?.image || ""} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-white font-bold text-sm uppercase tracking-tighter">{session.user?.name}</p>
                        <p className="text-primary text-[8px] uppercase font-black tracking-widest">View Profile</p>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link 
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 p-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-[10px]"
                      >
                        <LayoutDashboard size={18} /> Admin Control Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-red-400/10 text-red-400 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-white/50 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                  >
                    <User size={16} /> Member Access
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
