export const siteConfig = {
  name: "VOGUE VAULT",
  admins: ["sssgkfkdk@gmail.com"],
  banners: [
    {
      id: '1',
      title: "FUTURE FASHION NOW.",
      subtitle: "Exclusive status-driven drops. Once they're gone, they're gone forever.",
      buttonText: "EXPLORE DROPS",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&fit=crop"
    },
    {
      id: '2',
      title: "LUXE COLLECTION 2026",
      subtitle: "Experience the pinnacle of premium streetwear and accessories.",
      buttonText: "VIEW COLLECTION",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&fit=crop"
    }
  ],
  sections: {
    stories: {
      title: "Live Drops",
      showAddButton: false, // Hidden by default
    },
    products: {
      title: "Current Drops",
      subtitle: "Limited time availability. Prepaid orders only.",
      viewAllText: "VIEW ALL"
    }
  },
  // Initial Mock Data
  stories: [
    { id: '1', title: 'Summer Drop', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop' },
    { id: '2', title: 'Vintage', image: 'https://images.unsplash.com/photo-1529139513477-3efb36ad0474?w=200&h=200&fit=crop' },
    { id: '3', title: 'Luxe', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop' },
    { id: '4', title: 'Streetwear', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop' },
    { id: '5', title: 'Evening', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop' },
  ],
  products: [
    { id: '1', name: 'Cyberpunk Jacket', price: 4999, category: 'men', sizes: ['M', 'L'], image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&fit=crop', expiryAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString() },
    { id: '2', name: 'Noir Trench Coat', price: 8999, category: 'women', sizes: ['S'], image: 'https://images.unsplash.com/photo-1544022613-e87ce71c85b9?w=500&fit=crop', expiryAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString() },
    { id: '3', name: 'Electric Sneakers', price: 3499, category: 'unisex', sizes: ['9', '10'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&fit=crop', expiryAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString() },
  ]
};
