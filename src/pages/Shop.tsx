import { useState } from 'react';
import { Star, ShoppingCart, Heart, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Shop = () => {
  const { toast } = useToast();
  const [currency, setCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});

  const products = [
    {
      id: 1,
      name: "Pro Performance Protein",
      category: "supplements",
      price: { USD: 89.99, NGN: 45000, GBP: 69.99 },
      originalPrice: { USD: 109.99, NGN: 55000, GBP: 85.99 },
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      inStock: true,
      description: "Premium whey protein blend for muscle growth and recovery"
    },
    {
      id: 2,
      name: "Smart Fitness Tracker",
      category: "equipment",
      price: { USD: 199.99, NGN: 98000, GBP: 159.99 },
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 89,
      badge: "New",
      inStock: true,
      description: "Advanced fitness tracking with heart rate monitoring"
    },
    {
      id: 3,
      name: "Resistance Band Set",
      category: "equipment",
      price: { USD: 29.99, NGN: 15000, GBP: 24.99 },
      originalPrice: { USD: 39.99, NGN: 20000, GBP: 32.99 },
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 156,
      badge: "Sale",
      inStock: true,
      description: "Professional grade resistance bands for full body workouts"
    },
    {
      id: 4,
      name: "Energy Boost Pre-Workout",
      category: "supplements",
      price: { USD: 49.99, NGN: 25000, GBP: 39.99 },
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 78,
      badge: "Popular",
      inStock: true,
      description: "Natural energy formula for intense workout sessions"
    },
    {
      id: 5,
      name: "Yoga Mat Premium",
      category: "equipment",
      price: { USD: 59.99, NGN: 30000, GBP: 47.99 },
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 203,
      badge: "Top Rated",
      inStock: false,
      description: "Eco-friendly premium yoga mat with superior grip"
    },
    {
      id: 6,
      name: "Recovery Magnesium",
      category: "supplements",
      price: { USD: 34.99, NGN: 17500, GBP: 27.99 },
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
      rating: 4.4,
      reviews: 67,
      badge: "",
      inStock: true,
      description: "Essential minerals for muscle recovery and better sleep"
    }
  ];

  const formatPrice = (price: any) => {
    const rates = { USD: '$', NGN: '₦', GBP: '£' };
    return `${rates[currency as keyof typeof rates]}${price[currency as keyof typeof price].toLocaleString()}`;
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'best seller': return 'bg-primary text-primary-foreground';
      case 'new': return 'bg-cyber-blue text-white';
      case 'sale': return 'bg-energy-green text-white';
      case 'popular': return 'bg-secondary text-secondary-foreground';
      case 'top rated': return 'bg-gradient-primary text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const addToCart = (productId: number, productName: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));

    toast({
      title: "Added to Cart!",
      description: `${productName} has been added to your cart.`,
      duration: 2000,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price[currency as keyof typeof a.price] - b.price[currency as keyof typeof b.price];
      case 'price-high': return b.price[currency as keyof typeof b.price] - a.price[currency as keyof typeof a.price];
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Fitness Store
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Premium fitness equipment and supplements to fuel your transformation
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                {['USD', 'NGN', 'GBP'].map((curr) => (
                  <Button
                    key={curr}
                    variant={currency === curr ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrency(curr)}
                    className={currency === curr ? "btn-primary" : ""}
                  >
                    {curr}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border hover:border-primary/30"
              >
                {/* Product Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className={getBadgeVariant(product.badge)}>
                      {product.badge}
                    </Badge>
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background transition-colors">
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-energy-green fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => addToCart(product.id, product.name)}
                    disabled={!product.inStock}
                    className={`w-full ${product.inStock ? 'btn-primary' : ''}`}
                    variant={product.inStock ? "default" : "secondary"}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    {cartItems[product.id] && (
                      <Badge className="ml-2 bg-white/20 text-white">
                        {cartItems[product.id]}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;