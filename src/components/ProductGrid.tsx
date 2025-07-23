import { useState } from 'react';
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: "Pro Performance Whey",
      category: "Supplements",
      price: { usd: 49.99, naira: 24999, gbp: 39.99 },
      originalPrice: { usd: 59.99, naira: 29999, gbp: 49.99 },
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      badge: "Best Seller",
      inStock: true
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      category: "Tech",
      price: { usd: 89.99, naira: 44999, gbp: 69.99 },
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1583623051567-ac3532c8fb83?w=400&h=400&fit=crop",
      badge: "New",
      inStock: true
    },
    {
      id: 3,
      name: "Resistance Band Set",
      category: "Equipment",
      price: { usd: 29.99, naira: 14999, gbp: 24.99 },
      originalPrice: { usd: 39.99, naira: 19999, gbp: 34.99 },
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 4,
      name: "Smart Fitness Tracker",
      category: "Tech",
      price: { usd: 199.99, naira: 99999, gbp: 159.99 },
      rating: 4.6,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      badge: "Premium",
      inStock: true
    },
    {
      id: 5,
      name: "Yoga Mat Premium",
      category: "Equipment",
      price: { usd: 59.99, naira: 29999, gbp: 49.99 },
      rating: 4.8,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 6,
      name: "Pre-Workout Energy",
      category: "Supplements",
      price: { usd: 39.99, naira: 19999, gbp: 32.99 },
      originalPrice: { usd: 49.99, naira: 24999, gbp: 42.99 },
      rating: 4.5,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      badge: "Sale",
      inStock: true
    },
    {
      id: 7,
      name: "Adjustable Dumbbells",
      category: "Equipment",
      price: { usd: 299.99, naira: 149999, gbp: 249.99 },
      rating: 4.9,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      badge: "Premium",
      inStock: false
    },
    {
      id: 8,
      name: "Recovery Massage Gun",
      category: "Recovery",
      price: { usd: 149.99, naira: 74999, gbp: 119.99 },
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 9,
      name: "Protein Shaker Bottle",
      category: "Accessories",
      price: { usd: 19.99, naira: 9999, gbp: 16.99 },
      rating: 4.4,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 10,
      name: "Athletic Training Shoes",
      category: "Apparel",
      price: { usd: 129.99, naira: 64999, gbp: 109.99 },
      originalPrice: { usd: 159.99, naira: 79999, gbp: 139.99 },
      rating: 4.6,
      reviews: 298,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      badge: "Hot",
      inStock: true
    },
    {
      id: 11,
      name: "Gym Towel Set",
      category: "Accessories",
      price: { usd: 24.99, naira: 12499, gbp: 19.99 },
      rating: 4.3,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 12,
      name: "Fitness Meal Prep Containers",
      category: "Nutrition",
      price: { usd: 34.99, naira: 17499, gbp: 28.99 },
      rating: 4.5,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=400&fit=crop",
      inStock: true
    }
  ];

  const [currency, setCurrency] = useState('usd');

  const formatPrice = (price: any) => {
    const symbols = { usd: '$', naira: '₦', gbp: '£' };
    return `${symbols[currency as keyof typeof symbols]}${price[currency as keyof typeof price]}`;
  };

  const getBadgeVariant = (badge: string) => {
    const variants: Record<string, string> = {
      'Best Seller': 'bg-gradient-primary',
      'New': 'bg-gradient-secondary',
      'Premium': 'bg-cyber-blue',
      'Sale': 'bg-energy-green',
      'Hot': 'bg-gradient-secondary'
    };
    return variants[badge] || 'bg-muted';
  };

  return (
    <section id="shop" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Premium</span>
            <br />
            Fitness Gear
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our curated collection of high-performance fitness products designed to elevate your workout experience.
          </p>
          
          {/* Currency Selector */}
          <div className="flex justify-center space-x-2 mb-8">
            {['usd', 'naira', 'gbp'].map((curr) => (
              <Button
                key={curr}
                variant={currency === curr ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency(curr)}
                className={currency === curr ? "btn-primary" : ""}
              >
                {curr.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card-glass group cursor-pointer relative overflow-hidden">
              {/* Badge */}
              {product.badge && (
                <Badge className={`absolute top-4 left-4 z-10 ${getBadgeVariant(product.badge)} text-white`}>
                  {product.badge}
                </Badge>
              )}

              {/* Wishlist Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Heart className="h-4 w-4" />
              </Button>

              {/* Product Image */}
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-muted-foreground font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button 
                  className="w-full btn-secondary mt-4 group-hover:btn-primary transition-all duration-300"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button className="btn-primary text-lg px-8 py-4">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;