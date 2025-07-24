import { useState } from 'react';
import { Search, Filter, Grid, ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { addItem, setCurrency, state, formatPrice } = useCart();

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
      inStock: true,
      description: "Premium whey protein for muscle building and recovery"
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
      inStock: true,
      description: "High-quality wireless earbuds with noise cancellation"
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
      inStock: true,
      description: "Complete resistance training system for home workouts"
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
      inStock: true,
      description: "Advanced fitness tracking with heart rate monitoring"
    },
    {
      id: 5,
      name: "Yoga Mat Premium",
      category: "Equipment",
      price: { usd: 59.99, naira: 29999, gbp: 49.99 },
      rating: 4.8,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      inStock: true,
      description: "Eco-friendly yoga mat with superior grip and cushioning"
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
      inStock: true,
      description: "Clean energy boost for intense workout sessions"
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
      inStock: false,
      description: "Space-saving adjustable dumbbells for home gym"
    },
    {
      id: 8,
      name: "Recovery Massage Gun",
      category: "Recovery",
      price: { usd: 149.99, naira: 74999, gbp: 119.99 },
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      inStock: true,
      description: "Professional-grade percussion therapy for muscle recovery"
    },
    {
      id: 9,
      name: "Protein Shaker Bottle",
      category: "Accessories",
      price: { usd: 19.99, naira: 9999, gbp: 16.99 },
      rating: 4.4,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      inStock: true,
      description: "Leak-proof shaker bottle with mixing ball"
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
      inStock: true,
      description: "High-performance training shoes for all activities"
    },
  ];

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

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             product.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price[state.currency] - b.price[state.currency];
        case 'price-high':
          return b.price[state.currency] - a.price[state.currency];
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Fitness</span>
            <br />
            Shop
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium fitness gear, supplements, and accessories to power your transformation
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency Selector */}
          <div className="flex justify-center space-x-2 mb-8">
            {['usd', 'naira', 'gbp'].map((curr) => (
              <Button
                key={curr}
                variant={state.currency === curr ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency(curr as 'usd' | 'naira' | 'gbp')}
                className={state.currency === curr ? "btn-primary" : ""}
              >
                {curr.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="card-glass group cursor-pointer relative overflow-hidden">
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
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

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
                    className="w-full btn-secondary group-hover:btn-primary transition-all duration-300"
                    disabled={!product.inStock}
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria.</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;