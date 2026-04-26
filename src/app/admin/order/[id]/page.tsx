"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, ShieldCheck, MapPin, Phone, User, Calendar, XCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { orders, updateOrderStatus, shipOrder, cancelOrder } = useStore();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orders && id) {
      const found = orders.find(o => o.id === id);
      setOrder(found || null);
    }
  }, [orders, id]);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package size={48} className="text-white/20 mx-auto" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Order Not Found</h2>
          <Link href="/admin" className="text-primary text-xs uppercase font-bold hover:underline">
            RETURN TO DASHBOARD
          </Link>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const statusOptions = [
    { s: 'pending', label: 'Pending', icon: Package },
    { s: 'processing', label: 'Processing', icon: FileText },
    { s: 'shipped', label: 'Shipped', icon: Truck },
    { s: 'completed', label: 'Completed', icon: ShieldCheck },
    { s: 'cancelled', label: 'Cancelled', icon: XCircle }
  ];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <Navbar />

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-4">
            <button onClick={() => router.push('/admin')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Order #{order.id}</h1>
              <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} /> Placed on {order.date}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Amount</p>
            <p className="text-5xl font-black text-primary italic tracking-tighter">₹{order.total}</p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Left Column: Customer & Shipping (1 span) */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5 pb-4">Customer Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <User className="text-white/20 mt-1" size={16} />
                  <div>
                    <p className="text-white font-bold">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-white/20 mt-1" size={16} />
                  <div>
                    <p className="text-white font-bold">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-white/20 mt-1" size={16} />
                  <div>
                    <p className="text-white/60 text-sm leading-relaxed">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5 pb-4">Manage Status</h3>
              
              <div className="flex flex-col gap-3">
                {statusOptions.map((opt) => (
                  <button 
                    key={opt.s}
                    onClick={() => {
                      if (opt.s === 'shipped') {
                        const tid = prompt("Enter Tracking ID / Carrier Details:");
                        if (tid) shipOrder(order.id, tid);
                      } else if (opt.s === 'cancelled') {
                        if (confirm("Are you sure? This will return items to inventory.")) {
                          cancelOrder(order.id);
                        }
                      } else {
                        updateOrderStatus(order.id, opt.s as any);
                      }
                    }}
                    disabled={order.status === opt.s}
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      order.status === opt.s 
                        ? 'bg-white/10 text-white border border-white/20 cursor-default' 
                        : 'bg-black text-white/40 hover:bg-white/5 hover:text-white border border-white/5'
                    }`}
                  >
                    <opt.icon size={16} className={order.status === opt.s ? 'text-primary' : ''} />
                    {opt.label}
                    {order.status === opt.s && <span className="ml-auto text-[8px] bg-primary text-black px-2 py-0.5 rounded-full">Current</span>}
                  </button>
                ))}
              </div>

              {order.status === 'shipped' && order.trackingId && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Tracking Info</p>
                  <p className="text-white font-bold">{order.trackingId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Items (2 spans) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center justify-between">
                 <span>Items Ordered</span>
                 <span className="text-white/20">{order.items.length} Items</span>
               </h3>
               
               <div className="space-y-4">
                 {order.items.map((item: any, i: number) => (
                   <div key={i} className="flex gap-6 p-4 bg-black/40 rounded-[2rem] border border-white/5 items-center group hover:border-white/20 transition-all">
                     <img src={item.image} className="w-24 h-24 rounded-[1.5rem] object-cover" />
                     <div className="flex-1">
                       <p className="text-xl font-black text-white uppercase tracking-tighter mb-1">{item.name}</p>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">SIZE: {item.size}</p>
                       <p className="text-sm text-white/40 font-bold">Qty: {item.quantity}</p>
                     </div>
                     <div className="text-right pr-4">
                       <p className="text-2xl font-black text-white italic">₹{item.price}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
