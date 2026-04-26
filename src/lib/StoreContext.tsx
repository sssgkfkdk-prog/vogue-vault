"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig as initialConfig } from './config';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  trackingId?: string;
  date: string;
}

interface StoreContextType {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  siteContent: typeof initialConfig;
  addToCart: (product: any, size?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleFavorite: (id: string) => void;
  updateSiteContent: (newContent: Partial<typeof initialConfig>) => void;
  addProduct: (product: any) => void;
  removeProduct: (productId: string) => void;
  removeProductSize: (productId: string, size: string) => void;
  addStory: (story: any) => void;
  removeStory: (storyId: string) => void;
  addBanner: (banner: any) => void;
  removeBanner: (bannerId: string) => void;
  clearCart: () => void;
  placeOrder: (customer: { name: string, phone: string, address: string }) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  shipOrder: (orderId: string, trackingId: string) => void;
  cancelOrder: (orderId: string) => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteContent, setSiteContent] = useState(initialConfig);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vogue_cart');
    const savedFavs = localStorage.getItem('vogue_favs');
    const savedContent = localStorage.getItem('vogue_content');
    const savedOrders = localStorage.getItem('vogue_orders');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (savedContent) setSiteContent(JSON.parse(savedContent));
    
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Force 100 orders for the demo if not already there
      if (parsedOrders.length < 100) {
        injectDemoOrder();
      } else {
        setOrders(parsedOrders);
      }
    } else {
      injectDemoOrder();
    }
  }, []);

  const injectDemoOrder = () => {
    const names = ["Rahul Malhotra", "Priya Singh", "Aryan Sharma", "Sneha Kapoor", "Vikram Rathore", "Ananya Iyer", "Karan Johar", "Ishita Patel", "Zaid Khan", "Meera Reddy", "Siddharth Malhotra", "Kriti Sanon"];
    const statuses: Order["status"][] = ["pending", "processing", "shipped", "completed", "cancelled"];
    const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];
    
    const dummyOrders: Order[] = Array.from({ length: 100 }).map((_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      return {
        id: `ORD-VAULT-${1000 - i}`,
        customerName: names[Math.floor(Math.random() * names.length)],
        phone: `+91 ${7000000000 + Math.floor(Math.random() * 2999999999)}`,
        address: `Apt ${100 + i}, ${cities[Math.floor(Math.random() * cities.length)]} Residency, Sector ${Math.floor(Math.random() * 50)}`,
        items: [{
          id: `p-${i % 10}`,
          name: i % 2 === 0 ? "Signature Elite Tee" : "Vault Limited Hoodie",
          price: 2499 + Math.floor(Math.random() * 5000),
          image: i % 2 === 0 
            ? "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
          quantity: 1,
          size: ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)]
        }],
        total: 2499 + Math.floor(Math.random() * 5000),
        status: status,
        date: new Date(Date.now() - (Math.floor(Math.random() * 90) * 3600000 * 24)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    });

    setOrders(dummyOrders);
  };

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('vogue_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vogue_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vogue_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('vogue_orders', JSON.stringify(orders));
  }, [orders]);

  const updateSiteContent = (newContent: Partial<typeof initialConfig>) => {
    setSiteContent(prev => ({ ...prev, ...newContent }));
  };

  const addProduct = (product: any) => {
    setSiteContent(prev => ({
      ...prev,
      products: [
        { 
          id: Math.random().toString(36).substr(2, 9),
          ...product,
          expiryAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
        },
        ...prev.products
      ]
    }));
  };

  const addStory = (story: any) => {
    setSiteContent(prev => ({
      ...prev,
      stories: [
        { id: Math.random().toString(36).substr(2, 9), ...story },
        ...prev.stories
      ]
    }));
  };

  const removeStory = (id: string) => {
    setSiteContent(prev => ({
      ...prev,
      stories: prev.stories.filter(s => s.id !== id)
    }));
  };

  const removeProduct = (id: string) => {
    setSiteContent(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const removeProductSize = (productId: string, size: string) => {
    setSiteContent(prev => {
      const updatedProducts = prev.products.map(p => {
        if (p.id === productId) {
          const newSizes = p.sizes.filter((s: string) => s !== size);
          return { ...p, sizes: newSizes };
        }
        return p;
      }).filter(p => p.sizes.length > 0); // Automatically remove product if no sizes left

      return { ...prev, products: updatedProducts };
    });
  };

  const addBanner = (banner: any) => {
    setSiteContent(prev => ({
      ...prev,
      banners: [
        { id: Math.random().toString(36).substr(2, 9), ...banner },
        ...prev.banners
      ]
    }));
  };

  const removeBanner = (id: string) => {
    setSiteContent(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
  };

  const addToCart = (product: any, size?: string) => {
    // When adding to cart, we consider it a 'reservation' or 'sale' in this 1-piece model
    if (size) {
      removeProductSize(product.id, size);
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        // Since each piece is unique (1 per size), we don't really increment quantity 
        // beyond 1 for the same size, but we'll keep the logic for safety.
        return prev.map(item => 
          (item.id === product.id && item.size === size) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customer: { name: string, phone: string, address: string }) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      items: [...cart],
      total,
      status: "pending",
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const shipOrder = (orderId: string, trackingId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingId, status: "shipped" } : o));
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'cancelled') return;

    // Return items to inventory
    setSiteContent(prev => ({
      ...prev,
      products: prev.products.map(p => {
        const itemsToReturn = order.items.filter(item => item.id === p.id);
        if (itemsToReturn.length > 0) {
          const newSizes = [...p.sizes, ...itemsToReturn.map(i => i.size).filter(Boolean) as string[]];
          // Remove duplicates just in case
          return { ...p, sizes: Array.from(new Set(newSizes)) };
        }
        return p;
      })
    }));

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{ 
      cart, 
      favorites, 
      orders,
      siteContent,
      addToCart, 
      removeFromCart,
      updateQuantity,
      toggleFavorite, 
      updateSiteContent,
      addProduct,
      removeProduct,
      removeProductSize,
      addStory,
      removeStory,
      addBanner,
      removeBanner,
      clearCart,
      placeOrder,
      updateOrderStatus,
      shipOrder,
      cancelOrder,
      cartCount,
      cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
