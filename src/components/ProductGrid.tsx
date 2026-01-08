import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Star,
  Heart,
  ArrowRight,
  Loader2,
  Zap,
  Sparkles,
  TrendingUp,
  X,
  Check,
  Package,
  Truck,
  Shield,
  Eye,
  List,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { apiService, Product as ApiProduct } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Fallback images for products
const productImages: Record<string, string> = {
  Supplements:
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
  Tech: "https://images.unsplash.com/photo-1583623051567-ac3532c8fb83?w=400&h=400&fit=crop",
  Equipment:
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
  Recovery:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
  Accessories:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
  Apparel:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
  Nutrition:
    "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=400&fit=crop",
  default:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
};

interface Product {
  id: number;
  name: string;
  price: { usd: number; naira: number; gbp: number };
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  badge?: string;
  originalPrice?: { usd: number; naira: number; gbp: number };
  description?: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  wishlist: Set<number>;
}

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}: QuickViewModalProps) => {
  const { state } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const formatPrice = (price: { usd: number; naira: number; gbp: number }) => {
    try {
      const symbols = { usd: "$", naira: "₦", gbp: "£" };
      const symbol = symbols[state.currency as keyof typeof symbols] || "$";
      const amount = price?.[state.currency as keyof typeof price];

      if (typeof amount !== "number" || isNaN(amount)) {
        return `${symbol}0.00`;
      }

      const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return `${symbol}${formattedAmount}`;
    } catch (error) {
      return "$0.00";
    }
  };

  if (!product || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Modal Content */}
        <div
          ref={modalRef}
          className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white rounded-full shadow-lg"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0">
              {/* Left Column - Image Gallery */}
              <div className="p-4 md:p-6 lg:p-8">
                <div className="sticky top-0">
                  <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <Badge className="px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl bg-gradient-to-r from-[#9902f7] to-[#ff6b6b] text-white">
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Additional Images Preview */}
                  <div className="grid grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4">
                    {[1, 2, 3, 4].map((num) => (
                      <div
                        key={num}
                        className={`aspect-square overflow-hidden rounded-lg cursor-pointer transition-all ${
                          selectedImage === num - 1
                            ? "ring-2 ring-[#9902f7]"
                            : "hover:opacity-80"
                        }`}
                        onClick={() => setSelectedImage(num - 1)}
                      >
                        <img
                          src={product.image}
                          alt={`${product.name} view ${num}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="p-4 md:p-6 lg:p-8 flex flex-col">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-2">
                  {/* Category & Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <Badge
                      variant="outline"
                      className="px-3 py-1 border-gray-300/50 w-fit"
                    >
                      {product.category}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-amber-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {product.rating?.toFixed(1)} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    {product.description ||
                      "Premium quality product designed for optimal performance. Built with high-grade materials and engineered for durability."}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 mr-2 md:mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base">
                        Premium Quality Materials
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 mr-2 md:mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base">
                        30-Day Money Back Guarantee
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 mr-2 md:mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base">
                        Free Worldwide Shipping
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 mr-2 md:mr-3 flex-shrink-0" />
                      <span className="text-sm md:text-base">
                        24/7 Customer Support
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-baseline space-x-2 md:space-x-3">
                      <span className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-base md:text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 text-xs"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                        In Stock • Ready to Ship
                      </Badge>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200/50 mb-6">
                    <div className="text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-full bg-blue-50 flex items-center justify-center">
                        <Truck className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-full bg-green-50 flex items-center justify-center">
                        <Package className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                      </div>
                      <p className="text-xs font-medium">30-Day Returns</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-full bg-purple-50 flex items-center justify-center">
                        <Shield className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                      </div>
                      <p className="text-xs font-medium">2-Year Warranty</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t border-gray-200/50 sticky bottom-0 bg-white/90 backdrop-blur-sm">
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] text-white py-3 md:py-4 text-base md:text-lg rounded-xl hover:shadow-xl transition-all duration-300 group"
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                  >
                    <ShoppingCart className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 group-hover:scale-125 transition-transform" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 py-3 md:py-4 text-base md:text-lg rounded-xl border-2 hover:border-[#9902f7] hover:bg-[#9902f7]/5 transition-all duration-300"
                    onClick={() => {
                      onToggleWishlist(product.id);
                    }}
                  >
                    <Heart
                      className={`mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 ${
                        wishlist.has(product.id)
                          ? "fill-current text-rose-500"
                          : ""
                      }`}
                    />
                    {wishlist.has(product.id) ? "Remove" : "Wishlist"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get wishlist from localStorage
const getStoredWishlist = (): Set<number> => {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("productGridWishlist");
    if (stored) {
      const ids = JSON.parse(stored);
      return new Set(Array.isArray(ids) ? ids : []);
    }
  } catch (error) {
    console.error("Error reading wishlist from localStorage:", error);
  }
  return new Set();
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (wishlist: Set<number>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "productGridWishlist",
      JSON.stringify(Array.from(wishlist))
    );
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

// Helper function to get view mode from localStorage
const getStoredViewMode = (): "grid" | "list" => {
  if (typeof window === "undefined") return "grid";
  try {
    const stored = localStorage.getItem("productGridViewMode");
    return (stored as "grid" | "list") || "grid";
  } catch (error) {
    console.error("Error reading view mode from localStorage:", error);
    return "grid";
  }
};

// Helper function to save view mode to localStorage
const saveViewModeToStorage = (viewMode: "grid" | "list") => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("productGridViewMode", viewMode);
  } catch (error) {
    console.error("Error saving view mode to localStorage:", error);
  }
};

const ProductGrid = () => {
  const { addItem, setCurrency, state } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(getStoredWishlist());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [showWishlist, setShowWishlist] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    getStoredViewMode()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    saveWishlistToStorage(wishlist);
  }, [wishlist]);

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    saveViewModeToStorage(viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProducts = await apiService.getProducts();

      const transformedProducts: Product[] = apiProducts.map(
        (apiProduct: ApiProduct, index: number) => {
          const id =
            typeof apiProduct.id === "string"
              ? parseInt(apiProduct.id.replace(/\D/g, "")) || index + 1
              : typeof apiProduct.id === "number"
              ? apiProduct.id
              : index + 1;

          const category = apiProduct.category || "Equipment";
          const image =
            apiProduct.image ||
            productImages[category] ||
            productImages.default;
          const inStock = apiProduct.inStock !== false;

          let price = apiProduct.price;
          if (!price || typeof price !== "object") {
            price = { usd: 0, naira: 0, gbp: 0 };
          } else {
            price = {
              usd: typeof price.usd === "number" ? price.usd : 0,
              naira: typeof price.naira === "number" ? price.naira : 0,
              gbp: typeof price.gbp === "number" ? price.gbp : 0,
            };
          }

          const rating = 4.5 + Math.random() * 0.5;
          const reviews = Math.floor(Math.random() * 300) + 50;

          return {
            id,
            name: apiProduct.name || `Product ${id}`,
            price: price,
            image,
            category,
            inStock,
            rating: parseFloat(rating.toFixed(1)),
            reviews,
            description: apiProduct.description,
          };
        }
      );

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again later.");
      setProducts(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = (): Product[] => [
    {
      id: 1,
      name: "Pro Performance Whey Protein",
      category: "Supplements",
      price: { usd: 49.99, naira: 24999, gbp: 39.99 },
      image: productImages.Supplements,
      inStock: true,
      rating: 4.8,
      reviews: 234,
      badge: "Best Seller",
      originalPrice: { usd: 59.99, naira: 29999, gbp: 49.99 },
      description:
        "Premium whey protein isolate with 25g protein per serving. Ideal for muscle recovery and growth. Low in sugar and fat.",
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      category: "Tech",
      price: { usd: 89.99, naira: 44999, gbp: 69.99 },
      image: productImages.Tech,
      inStock: true,
      rating: 4.9,
      reviews: 156,
      badge: "New",
      description:
        "Noise-cancelling wireless earbuds with 30-hour battery life. Perfect for workouts with IPX7 waterproof rating.",
    },
    {
      id: 3,
      name: "Resistance Band Set",
      category: "Equipment",
      price: { usd: 29.99, naira: 14999, gbp: 24.99 },
      image: productImages.Equipment,
      inStock: true,
      rating: 4.7,
      reviews: 89,
      originalPrice: { usd: 39.99, naira: 19999, gbp: 34.99 },
      description:
        "5-piece resistance band set with varying resistance levels. Includes door anchor and carrying bag.",
    },
    // ... (rest of mock data with descriptions)
  ];

  const formatPrice = (price: { usd: number; naira: number; gbp: number }) => {
    try {
      const symbols = { usd: "$", naira: "₦", gbp: "£" };
      const symbol = symbols[state.currency as keyof typeof symbols] || "$";
      const amount = price?.[state.currency as keyof typeof price];

      if (typeof amount !== "number" || isNaN(amount)) {
        return `${symbol}0.00`;
      }

      const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return `${symbol}${formattedAmount}`;
    } catch (error) {
      return "$0.00";
    }
  };

  const getBadgeVariant = (badge: string) => {
    const variants: Record<string, string> = {
      "Best Seller": "bg-gradient-to-r from-[#9902f7] to-[#ff6b6b]",
      New: "bg-gradient-to-r from-[#00d4ff] to-[#0099ff]",
      Premium: "bg-gradient-to-r from-[#667eea] to-[#764ba2]",
      Sale: "bg-gradient-to-r from-[#f093fb] to-[#f5576c]",
      Hot: "bg-gradient-to-r from-[#f6d365] to-[#fda085]",
    };
    return variants[badge] || "bg-gradient-to-r from-gray-600 to-gray-800";
  };

  const handleAddToCart = (product: Product) => {
    try {
      addItem(product);

      const btn = document.getElementById(`add-to-cart-${product.id}`);
      if (btn) {
        btn.classList.add("animate-pulse");
        setTimeout(() => {
          btn.classList.remove("animate-pulse");
        }, 500);
      }

      toast({
        title: "🎉 Added to cart",
        description: `${product.name} has been added to your cart`,
        className:
          "bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white border-0",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const toggleWishlist = (productId: number) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      toast({
        title: "Removed from wishlist",
        description: "Item removed from your wishlist",
      });
    } else {
      newWishlist.add(productId);
      const btn = document.getElementById(`wishlist-${productId}`);
      if (btn) {
        btn.classList.add("animate-spin");
        setTimeout(() => {
          btn.classList.remove("animate-spin");
        }, 500);
      }
      toast({
        title: "✨ Added to wishlist",
        description: "Item added to your wishlist",
        className:
          "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0",
      });
    }
    setWishlist(newWishlist);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const wishlistedProducts = products.filter((product) =>
    wishlist.has(product.id)
  );

  if (loading) {
    return (
      <section
        id="shop"
        className="py-24 bg-gradient-to-b from-background via-background/50 to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-[3px] border-transparent border-t-[#9902f7] border-r-[#667eea] border-b-[#00d4ff] animate-gradient-x"></div>
              <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-[#9902f7] animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent animate-gradient-x">
                Loading Premium Collection
              </h3>
              <p className="text-muted-foreground animate-pulse">
                Curating the finest fitness products for you
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section
        id="shop"
        className="py-24 bg-gradient-to-b from-background via-background/50 to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl animate-pulse">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-100 via-red-50 to-red-100 flex items-center justify-center animate-bounce">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-500 flex items-center justify-center animate-pulse">
                  <span className="text-white text-3xl">!</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                Connection Issue
              </h3>
              <p className="text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground animate-pulse">
                Showing demo products instead
              </p>
              <Button
                onClick={fetchProducts}
                className="mt-6 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] text-white hover:shadow-lg hover:shadow-[#9902f7]/30 transition-all duration-300 animate-gradient-x hover:scale-105"
              >
                <Zap className="mr-2 h-4 w-4" />
                Retry Loading Products
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="shop"
        className="py-24 bg-gradient-to-b from-background via-background/50 to-background relative overflow-hidden"
        ref={containerRef}
      >
        <style>
          {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.05); opacity: 0; }
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          @keyframes slide-in {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          
          .animate-pulse-ring {
            animation: pulse-ring 1.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
          }
          
          .animate-heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite;
          }
          
          .animate-slide-in {
            animation: slide-in 0.5s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.5s ease-out;
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}
        </style>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#9902f7]/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-[#9902f7]/10 via-[#667eea]/10 to-[#00d4ff]/10 mb-6 animate-gradient-x">
              <Sparkles className="h-4 w-4 text-[#9902f7] mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-[#9902f7]">
                PREMIUM COLLECTION
              </span>
              <Sparkles className="h-4 w-4 text-[#00d4ff] ml-2 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent animate-gradient-x">
                Elite Fitness
              </span>
              <br />
              <span className="text-foreground relative">
                Essentials
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] rounded-full"></span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Curated selection of high-performance gear designed for athletes
              who demand excellence.
            </p>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 animate-slide-up">
              {/* Currency Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  View prices in:
                </span>
                <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20 shadow-lg">
                  {(["usd", "naira", "gbp"] as const).map((curr) => (
                    <Button
                      key={curr}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrency(curr)}
                      className={cn(
                        "rounded-full transition-all duration-300 px-4 py-1.5 mx-1",
                        "border border-transparent",
                        state.currency === curr
                          ? "bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white shadow-lg scale-105 relative overflow-hidden"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-gray-100"
                      )}
                    >
                      {state.currency === curr && (
                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></span>
                      )}
                      <span className="relative z-10">
                        {curr.toUpperCase()}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* View Controls & Wishlist */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20 shadow-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "rounded-full transition-all duration-300 px-3",
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-gray-100"
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "rounded-full transition-all duration-300 px-3",
                      viewMode === "list"
                        ? "bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-gray-100"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="outline"
                  className={cn(
                    "rounded-full transition-all duration-300",
                    wishlist.size > 0
                      ? "bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-300 text-pink-700 hover:bg-pink-50"
                      : "border-white/20 text-gray-700 hover:border-white/30 hover:bg-white/10"
                  )}
                  onClick={() => setShowWishlist(!showWishlist)}
                >
                  <Heart
                    className={cn(
                      "mr-2 h-4 w-4",
                      wishlist.size > 0 && "fill-current text-rose-500"
                    )}
                  />
                  Wishlist
                  {wishlist.size > 0 && (
                    <Badge className="ml-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                      {wishlist.size}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Wishlist Section */}
          {showWishlist && wishlistedProducts.length > 0 && (
            <div className="mb-12 animate-slide-up">
              <div className="bg-gradient-to-r from-white/90 via-white/80 to-white/70 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center">
                    <Heart className="mr-3 h-6 w-6 text-rose-500 fill-current" />
                    My Wishlist
                    <Badge className="ml-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                      {wishlist.size} {wishlist.size === 1 ? "item" : "items"}
                    </Badge>
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to clear your wishlist?"
                          )
                        ) {
                          setWishlist(new Set());
                          toast({
                            title: "Wishlist cleared",
                            description:
                              "All items have been removed from your wishlist",
                          });
                        }
                      }}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowWishlist(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-all duration-300 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white hover:opacity-90"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 hover:bg-rose-50 hover:text-rose-600"
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {wishlistedProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click the heart icon on products to add them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty Wishlist Message */}
          {showWishlist && wishlistedProducts.length === 0 && (
            <div className="mb-12 animate-slide-up">
              <div className="bg-gradient-to-r from-white/90 via-white/80 to-white/70 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Your Wishlist is Empty
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't added any products to your wishlist yet.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Click the ❤️ heart icon on any product to add it here
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowWishlist(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div
            className={cn(
              "gap-8 lg:gap-10",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid grid-cols-1"
            )}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "group relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/30 shadow-2xl hover:shadow-[#9902f7]/20 transition-all duration-700 hover:-translate-y-2",
                  viewMode === "grid"
                    ? "hover:scale-[1.02]"
                    : "flex flex-col sm:flex-row"
                )}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9902f7]/0 via-[#667eea]/0 to-[#00d4ff]/0 group-hover:from-[#9902f7]/5 group-hover:via-[#667eea]/5 group-hover:to-[#00d4ff]/5 transition-all duration-1000 pointer-events-none"></div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="w-full h-full bg-white rounded-3xl"></div>
                </div>

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-20 animate-slide-in">
                    <Badge
                      className={cn(
                        "px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl",
                        getBadgeVariant(product.badge),
                        "text-white relative overflow-hidden"
                      )}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></span>
                      <span className="relative z-10">{product.badge}</span>
                    </Badge>
                  </div>
                )}

                {/* Wishlist Button */}
                <Button
                  id={`wishlist-${product.id}`}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 w-10 h-10 shadow-lg",
                    "group-hover:scale-110 group-hover:rotate-12",
                    wishlist.has(product.id) &&
                      "bg-gradient-to-r from-pink-500 to-rose-500"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all duration-300 group-hover:scale-125",
                      wishlist.has(product.id)
                        ? "fill-current text-white animate-heartbeat"
                        : "text-gray-600 group-hover:text-rose-500"
                    )}
                  />
                </Button>

                {/* Product Image */}
                <div
                  className={cn(
                    "relative overflow-hidden",
                    viewMode === "grid"
                      ? "h-60 rounded-t-3xl"
                      : "sm:w-1/3 h-60 sm:h-auto sm:rounded-l-3xl"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-1000 ease-out",
                      viewMode === "grid"
                        ? "group-hover:scale-125"
                        : "group-hover:scale-110"
                    )}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        productImages[product.category] ||
                        productImages.default;
                    }}
                  />

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-500 z-20">
                    <Button
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => openQuickView(product)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Quick View
                    </Button>
                  </div>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm flex items-center justify-center z-30">
                      <div className="text-center">
                        <span className="text-white font-bold text-lg">
                          Out of Stock
                        </span>
                        <p className="text-white/80 text-sm mt-1">
                          Notify when available
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div
                  className={cn(
                    "p-6 space-y-4 relative z-10 flex-1",
                    viewMode === "list" && "sm:w-2/3"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold px-3 py-1 border-gray-300/50 text-gray-700 bg-white/50 group-hover:border-[#9902f7]/30 group-hover:text-[#9902f7] transition-all duration-300"
                    >
                      {product.category}
                    </Badge>
                    {product.inStock ? (
                      <div className="flex items-center gap-2 animate-fade-in">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 animate-ping"></div>
                        <span className="text-xs font-semibold text-emerald-600">
                          In Stock
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h3
                    className={cn(
                      "font-bold text-foreground group-hover:text-[#9902f7] transition-colors duration-300",
                      viewMode === "grid"
                        ? "text-lg line-clamp-1 group-hover:translate-x-2"
                        : "text-xl"
                    )}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p
                      className={cn(
                        "text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300",
                        viewMode === "grid"
                          ? "text-sm line-clamp-2"
                          : "text-base"
                      )}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Rating */}
                  {product.rating !== undefined &&
                    product.reviews !== undefined && (
                      <div className="flex items-center space-x-2 pt-2 animate-fade-in">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4 transition-all duration-300 group-hover:scale-110",
                                i < Math.floor(product.rating!)
                                  ? "text-amber-400 fill-current"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {product.rating!.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                    )}

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <span className="text-lg font-black bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button with Overlapping Effect */}
                    <div className="relative">
                      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-white to-transparent"></div>
                      <Button
                        id={`add-to-cart-${product.id}`}
                        className={cn(
                          "rounded-l-full rounded-r-none px-6 py-3 transition-all duration-500",
                          "relative overflow-hidden group/btn",
                          "shadow-xl hover:shadow-2xl hover:shadow-[#9902f7]/30",
                          product.inStock
                            ? "bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] text-white hover:scale-105"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        {/* Button Shimmer Effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>

                        <div className="flex items-center justify-center gap-2 relative z-10">
                          {product.inStock ? (
                            <>
                              <ShoppingCart className="h-4 w-4 group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-all duration-300" />
                              <span className="text-sm font-semibold whitespace-nowrap group-hover/btn:tracking-wider transition-all duration-300">
                                Add to Cart
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover Particles Effect */}
                {hoveredCard === product.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-[#9902f7] to-[#00d4ff] rounded-full animate-float"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Pulse Ring Effect on Hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#9902f7]/20 group-hover:animate-pulse-ring pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-20 animate-slide-up">
            <Button
              className="group rounded-full bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] text-white px-8 md:px-12 py-5 md:py-7 text-lg md:text-xl font-bold hover:shadow-2xl hover:shadow-[#9902f7]/40 transition-all duration-500 hover:scale-105"
              onClick={() => (window.location.href = "/shop")}
            >
              <TrendingUp className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:rotate-12 transition-transform duration-300" />
              Explore Full Collection
              <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform duration-300" />
            </Button>
            <p className="text-sm text-gray-500 mt-4 md:mt-6">
              ✨ {products.length} premium products • Updated daily • Free
              shipping over $100
            </p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={closeQuickView}
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
        wishlist={wishlist}
      />
    </>
  );
};

export default ProductGrid;
