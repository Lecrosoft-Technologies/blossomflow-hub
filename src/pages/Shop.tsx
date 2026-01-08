import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Filter,
  Grid,
  ShoppingCart,
  Star,
  Heart,
  Loader2,
  X,
  Eye,
  Sparkles,
  TrendingUp,
  ArrowRight,
  SlidersHorizontal,
  Zap,
  Package,
  Truck,
  Shield,
  Check,
  List,
  ChevronDown,
  Dumbbell,
  Target,
  Activity,
  Award,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { apiService, Product } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Currency formatting utility function
const formatCurrency = (amount: number, currency: "usd" | "naira" | "gbp") => {
  const symbols = { usd: "$", naira: "₦", gbp: "£" };
  const symbol = symbols[currency];

  // Format with commas for thousands
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedAmount}`;
};

// Define local product interface that matches API response
interface DisplayProduct extends Product {
  rating?: number;
  reviews?: number;
  badges?: string[];
}

interface QuickViewModalProps {
  product: DisplayProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: DisplayProduct) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: Set<string>;
}

// Fallback images for categories
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

// Helper functions for localStorage
const getGlobalWishlist = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("globalWishlist");
    if (stored) {
      const ids = JSON.parse(stored);
      return new Set(Array.isArray(ids) ? ids : []);
    }
  } catch (error) {
    console.error("Error reading wishlist from localStorage:", error);
  }
  return new Set();
};

const saveGlobalWishlist = (wishlist: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "globalWishlist",
      JSON.stringify(Array.from(wishlist))
    );
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

const getStoredViewMode = (): "grid" | "list" => {
  if (typeof window === "undefined") return "grid";
  try {
    const stored = localStorage.getItem("shopViewMode");
    return (stored as "grid" | "list") || "grid";
  } catch (error) {
    console.error("Error reading view mode from localStorage:", error);
    return "grid";
  }
};

const saveViewModeToStorage = (viewMode: "grid" | "list") => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("shopViewMode", viewMode);
  } catch (error) {
    console.error("Error saving view mode to localStorage:", error);
  }
};

// Price range filter with slider
const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  currency,
}: {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  currency: string;
}) => {
  const formatCurrency = (value: number) => {
    const symbols = { usd: "$", naira: "₦", gbp: "£" };
    const symbol = symbols[currency as keyof typeof symbols] || "$";

    if (currency === "naira" && value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(0)}k`;
    }

    return `${symbol}${value.toFixed(2)}`;
  };

  const getMaxRange = () => {
    switch (currency) {
      case "naira":
        return 500000;
      case "usd":
        return 1000;
      case "gbp":
        return 800;
      default:
        return 1000;
    }
  };

  const maxRange = getMaxRange();

  const handleSliderChange = (values: number[]) => {
    onMinChange(values[0]);
    onMaxChange(values[1]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Price Range</span>
        <span className="text-xs text-gray-500 font-medium">
          {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
        </span>
      </div>
      <div className="space-y-4">
        <Slider
          defaultValue={[0, maxRange]}
          value={[minPrice, maxPrice]}
          max={maxRange}
          step={currency === "naira" ? 1000 : 10}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(maxRange)}</span>
        </div>
      </div>
    </div>
  );
};

// Quick View Modal Component
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

  const getImage = () => {
    return (
      product.image || productImages[product.category] || productImages.default
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div
          ref={modalRef}
          className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
        >
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
              <div className="p-4 md:p-6 lg:p-8">
                <div className="sticky top-0">
                  <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl">
                    <img
                      src={getImage()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badges && product.badges.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <Badge className="px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl bg-gradient-to-r from-[#9902f7] to-[#ff6b6b] text-white">
                          {product.badges[0]}
                        </Badge>
                      </div>
                    )}
                  </div>

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
                          src={getImage()}
                          alt={`${product.name} view ${num}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 lg:p-8 flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
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

                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    {product.description ||
                      "Premium quality product designed for optimal performance. Built with high-grade materials and engineered for durability."}
                  </p>

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

                  <div className="mb-6 md:mb-8">
                    <div className="flex items-baseline space-x-2 md:space-x-3">
                      <span className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
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

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DisplayProduct[]>(
    []
  );
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    getStoredViewMode()
  );
  const [wishlist, setWishlist] = useState<Set<string>>(getGlobalWishlist());
  const [showWishlist, setShowWishlist] = useState(false);
  const [quickViewProduct, setQuickViewProduct] =
    useState<DisplayProduct | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addItem, setCurrency, state, formatPrice } = useCart();

  useEffect(() => {
    saveGlobalWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    saveViewModeToStorage(viewMode);
  }, [viewMode]);

  useEffect(() => {
    const maxByCurrency = {
      usd: 1000,
      naira: 500000,
      gbp: 800,
    };

    setPriceRange((prev) => ({
      min: 0,
      max: maxByCurrency[state.currency] || 1000,
    }));
  }, [state.currency]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiProducts = await apiService.getProducts();

      if (!apiProducts || apiProducts.length === 0) {
        throw new Error("No products found");
      }

      const displayProducts: DisplayProduct[] = apiProducts.map((product) => {
        const firstBadge =
          product.badges && product.badges.length > 0
            ? product.badges[0]
            : undefined;

        let badge = firstBadge;
        if (!badge) {
          const category = product.category?.toLowerCase() || "";
          if (category.includes("supplement") || category.includes("protein")) {
            badge = "Muscle Fuel";
          } else if (
            category.includes("tech") ||
            category.includes("tracker")
          ) {
            badge = "Smart Gear";
          } else if (category.includes("equipment")) {
            badge = "Pro Grade";
          } else if (category.includes("apparel")) {
            badge = "Athletic Fit";
          } else if (product.price?.usd > 200) {
            badge = "Elite";
          } else if (product.price?.usd < 50) {
            badge = "Best Value";
          }
        }

        const productId = product.id?.toString() || "";

        const image =
          product.image ||
          productImages[product.category] ||
          productImages.default;

        return {
          ...product,
          id: productId,
          image: image,
          rating: product.rating || 4.0 + Math.random() * 1.5,
          reviews: product.reviews || Math.floor(Math.random() * 500) + 50,
          badges: product.badges || (badge ? [badge] : []),
        };
      });

      setProducts(displayProducts);

      const uniqueCategories = [
        "all",
        ...new Set(
          displayProducts
            .map((p) => p.category)
            .filter(Boolean)
            .sort()
        ),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Using demo fitness products. Check your API connection.");

      const mockDisplayProducts: DisplayProduct[] = [
        {
          id: "1",
          name: "Pro Performance Whey Protein",
          description:
            "Premium whey protein isolate with 25g protein per serving. Ideal for muscle recovery and growth.",
          price: { usd: 49.99, naira: 74985, gbp: 39.99 },
          category: "Supplements",
          inStock: true,
          image: productImages.Supplements,
          rating: 4.8,
          reviews: 234,
          badges: ["Muscle Fuel"],
        },
        {
          id: "2",
          name: "Smart Fitness Tracker",
          description:
            "Advanced activity tracking with heart rate monitoring and GPS. Waterproof design.",
          price: { usd: 129.99, naira: 194985, gbp: 109.99 },
          category: "Tech",
          inStock: true,
          image: productImages.Tech,
          rating: 4.6,
          reviews: 189,
          badges: ["Smart Gear"],
        },
      ];

      setProducts(mockDisplayProducts);
      setCategories([
        "all",
        "Supplements",
        "Tech",
        "Equipment",
        "Apparel",
        "Accessories",
        "Recovery",
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
      );
    }

    if (activeTab !== "all") {
      result = result.filter((product) => {
        switch (activeTab) {
          case "in-stock":
            return product.inStock;
          case "on-sale":
            return Math.random() > 0.5;
          case "top-rated":
            return product.rating && product.rating >= 4.5;
          case "new":
            return Math.random() > 0.7;
          default:
            return true;
        }
      });
    }

    result = result.filter((product) => {
      const price = product.price?.[state.currency] || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    if (ratingFilter !== null) {
      result = result.filter(
        (product) => product.rating && product.rating >= ratingFilter
      );
    }

    result.sort((a, b) => {
      const priceA = a.price?.[state.currency] || 0;
      const priceB = b.price?.[state.currency] || 0;
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;

      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "rating":
          return ratingB - ratingA;
        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    setFilteredProducts(result);
  }, [
    products,
    selectedCategory,
    searchTerm,
    sortBy,
    state.currency,
    activeTab,
    priceRange,
    ratingFilter,
  ]);

  const getBadgeVariant = (badge: string) => {
    const variants: Record<string, string> = {
      "Best Seller": "bg-gradient-to-r from-[#ff6b6b] to-[#ffa500]",
      "Muscle Fuel": "bg-gradient-to-r from-[#ff6b6b] to-[#ffa500]",
      Performance: "bg-gradient-to-r from-[#00d4ff] to-[#0099ff]",
      "Smart Gear": "bg-gradient-to-r from-[#667eea] to-[#764ba2]",
      "Pro Grade": "bg-gradient-to-r from-[#9902f7] to-[#ff6b6b]",
      "Athletic Fit": "bg-gradient-to-r from-[#f093fb] to-[#f5576c]",
      Elite: "bg-gradient-to-r from-[#f6d365] to-[#fda085]",
      "Best Value": "bg-gradient-to-r from-[#4CAF50] to-[#2E7D32]",
      Premium: "bg-gradient-to-r from-[#9C27B0] to-[#673AB7]",
      New: "bg-gradient-to-r from-[#00d4ff] to-[#0099ff]",
    };
    return variants[badge] || "bg-gradient-to-r from-[#9902f7] to-[#667eea]";
  };

  const handleAddToCart = (displayProduct: DisplayProduct) => {
    try {
      const cartProduct = {
        id: parseInt(displayProduct.id, 10),
        name: displayProduct.name,
        price: displayProduct.price,
        image: displayProduct.image,
        category: displayProduct.category,
        inStock: displayProduct.inStock,
      };

      addItem(cartProduct);

      const btn = document.getElementById(`add-to-cart-${displayProduct.id}`);
      if (btn) {
        btn.classList.add("animate-pulse");
        setTimeout(() => {
          btn.classList.remove("animate-pulse");
        }, 500);
      }

      toast({
        title: "🎉 Added to cart",
        description: `${displayProduct.name} has been added to your cart`,
        className:
          "bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white border-0",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        className: "bg-red-500 text-white",
      });
    }
  };

  const toggleWishlist = (productId: string) => {
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

  const openQuickView = (product: DisplayProduct) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const clearAllFilters = () => {
    const maxByCurrency = {
      usd: 1000,
      naira: 500000,
      gbp: 800,
    };

    setPriceRange({
      min: 0,
      max: maxByCurrency[state.currency] || 1000,
    });
    setRatingFilter(null);
    setSelectedCategory("all");
    setSearchTerm("");
    setActiveTab("all");
  };

  const wishlistedProducts = products.filter((product) =>
    wishlist.has(product.id.toString())
  );

  const AnimationStyles = () => (
    <style>
      {`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}
    </style>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="relative mx-auto w-24 h-24">
            <div className="animate-spin rounded-full h-24 w-24 border-[3px] border-transparent border-t-[#9902f7] border-r-[#667eea] border-b-[#00d4ff]"></div>
            <Dumbbell className="absolute inset-0 m-auto h-12 w-12 text-[#9902f7] animate-pulse" />
          </div>
          <p className="mt-6 text-xl text-gray-600">
            Loading premium fitness gear...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
        <AnimationStyles />

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
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

        <Header />

        <div className="relative z-10">
          <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/15 via-[#667eea]/15 to-[#00d4ff]/15">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full border-4 border-[#9902f7]"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full border-4 border-[#667eea]"></div>
                <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full border-4 border-[#00d4ff]"></div>
              </div>
            </div>

            <div className="absolute top-10 left-10 opacity-15">
              <Dumbbell className="h-20 w-20 text-[#9902f7]" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-15">
              <Target className="h-20 w-20 text-[#667eea]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-[#9902f7]/20 via-[#667eea]/20 to-[#00d4ff]/20 mb-6">
                  <Sparkles className="h-4 w-4 text-[#9902f7] mr-2" />
                  <span className="text-sm font-semibold text-[#9902f7]">
                    PREMIUM FITNESS COLLECTION
                  </span>
                  <Sparkles className="h-4 w-4 text-[#00d4ff] ml-2" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                  <span className="bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent">
                    Transform Your
                  </span>
                  <br />
                  <span className="text-gray-900">
                    <Flame className="inline h-12 w-12 text-orange-500 mb-2" />{" "}
                    Fitness Journey
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                  Fuel your performance with elite equipment, supplements, and
                  gear designed for athletes who demand excellence. Built for
                  strength, engineered for results.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {[
                    {
                      icon: Dumbbell,
                      value: products.length.toString(),
                      label: "Premium Products",
                    },
                    { icon: Award, value: "4.8", label: "Avg Rating" },
                    { icon: Truck, value: "Free", label: "Shipping" },
                    { icon: Shield, value: "2 Year", label: "Warranty" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm"
                    >
                      <stat.icon className="h-6 w-6 text-[#9902f7] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-700">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <main className="pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-4 mb-8">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search fitness products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white border-gray-200 h-10 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 md:hidden">
                      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 bg-white flex-1 min-w-[100px]"
                          >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px]">
                          <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                          </SheetHeader>
                          <div className="py-6 space-y-6">
                            <PriceRangeFilter
                              minPrice={priceRange.min}
                              maxPrice={priceRange.max}
                              onMinChange={(value) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: value,
                                }))
                              }
                              onMaxChange={(value) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: value,
                                }))
                              }
                              currency={state.currency}
                            />

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-700">
                                Rating
                              </h4>
                              <div className="space-y-2">
                                {[4.5, 4, 3.5, 3].map((rating) => (
                                  <Button
                                    key={rating}
                                    variant={
                                      ratingFilter === rating
                                        ? "default"
                                        : "ghost"
                                    }
                                    size="sm"
                                    className="w-full justify-start text-gray-700 hover:text-gray-900"
                                    onClick={() =>
                                      setRatingFilter(
                                        ratingFilter === rating ? null : rating
                                      )
                                    }
                                  >
                                    <Star className="h-4 w-4 mr-2 text-amber-400 fill-current" />
                                    {rating}+ Stars
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={clearAllFilters}
                            >
                              Clear All Filters
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 bg-white flex-1 min-w-[100px]"
                          >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Sort
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSortBy("name")}>
                            Name (A-Z)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("price-low")}
                          >
                            Price: Low to High
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("price-high")}
                          >
                            Price: High to Low
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy("rating")}>
                            Highest Rated
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-200 h-10">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === "all" ? "All Categories" : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-40 bg-white border-gray-200 h-10">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === "all" ? "All Categories" : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 bg-white border-gray-200 h-10">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                          <SelectItem value="price-low">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-high">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className={cn(
                            "rounded-md px-3",
                            viewMode === "grid"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className={cn(
                            "rounded-md px-3",
                            viewMode === "list"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-gray-200",
                          wishlist.size > 0 &&
                            "border-pink-300 bg-pink-50 text-pink-700"
                        )}
                        onClick={() => setShowWishlist(!showWishlist)}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 mr-2",
                            wishlist.size > 0 && "fill-current"
                          )}
                        />
                        Wishlist
                        {wishlist.size > 0 && (
                          <Badge className="ml-2 bg-pink-500 text-white">
                            {wishlist.size}
                          </Badge>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full md:w-auto"
                    >
                      <TabsList className="flex flex-wrap gap-1 bg-gray-100 p-1">
                        {[
                          { value: "all", label: "All" },
                          { value: "in-stock", label: "In Stock" },
                          { value: "on-sale", label: "Sale" },
                          { value: "top-rated", label: "Top Rated" },
                          { value: "new", label: "New" },
                        ].map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm flex-1 min-w-[70px]"
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 hidden sm:inline">
                        Currency:
                      </span>
                      <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        {(["usd", "naira", "gbp"] as const).map((curr) => (
                          <Button
                            key={curr}
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrency(curr)}
                            className={cn(
                              "rounded-md px-3 py-1",
                              state.currency === curr
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                          >
                            {curr.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {filteredProducts.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-900">
                        {products.length}
                      </span>{" "}
                      fitness products
                    </p>
                    {(searchTerm ||
                      selectedCategory !== "all" ||
                      activeTab !== "all" ||
                      priceRange.min > 0 ||
                      priceRange.max <
                        (state.currency === "naira"
                          ? 500000
                          : state.currency === "gbp"
                          ? 800
                          : 1000) ||
                      ratingFilter !== null) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-6">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Price Range
                        </h4>
                        <PriceRangeFilter
                          minPrice={priceRange.min}
                          maxPrice={priceRange.max}
                          onMinChange={(value) =>
                            setPriceRange((prev) => ({ ...prev, min: value }))
                          }
                          onMaxChange={(value) =>
                            setPriceRange((prev) => ({ ...prev, max: value }))
                          }
                          currency={state.currency}
                        />
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Rating
                        </h4>
                        <div className="space-y-2">
                          {[4.5, 4, 3.5, 3].map((rating) => (
                            <Button
                              key={rating}
                              variant={
                                ratingFilter === rating ? "default" : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start text-gray-700 hover:text-gray-900"
                              onClick={() =>
                                setRatingFilter(
                                  ratingFilter === rating ? null : rating
                                )
                              }
                            >
                              <Star className="h-4 w-4 mr-2 text-amber-400 fill-current" />
                              {rating}+ Stars
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Categories
                        </h4>
                        <div className="space-y-2">
                          {categories.slice(1).map((category) => (
                            <Button
                              key={category}
                              variant={
                                selectedCategory === category
                                  ? "default"
                                  : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start text-gray-700 hover:text-gray-900"
                              onClick={() => setSelectedCategory(category)}
                            >
                              <Dumbbell className="h-3 w-3 mr-2" />
                              {category}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 border-gray-200 text-gray-700 hover:text-gray-900"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  {showWishlist && wishlistedProducts.length > 0 && (
                    <div className="mb-8">
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Heart className="mr-3 h-5 w-5 text-rose-500 fill-current" />
                            My Wishlist
                            <Badge className="ml-3 bg-pink-500 text-white">
                              {wishlist.size}{" "}
                              {wishlist.size === 1 ? "item" : "items"}
                            </Badge>
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Clear your wishlist?")) {
                                  setWishlist(new Set());
                                  toast({
                                    title: "Wishlist cleared",
                                    description: "All items removed",
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
                              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-200"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {product.category}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="font-bold text-sm text-[#9902f7]">
                                    {formatPrice(product.price)}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white hover:opacity-90"
                                      onClick={() => handleAddToCart(product)}
                                    >
                                      <ShoppingCart className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 hover:bg-rose-50 hover:text-rose-600"
                                      onClick={() =>
                                        toggleWishlist(product.id.toString())
                                      }
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {showWishlist && wishlistedProducts.length === 0 && (
                    <div className="mb-8">
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Your Wishlist is Empty
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Save your favorite fitness gear for later
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          Click the ❤️ heart icon on products to add them here
                        </p>
                        <Button
                          variant="outline"
                          className="border-gray-200"
                          onClick={() => setShowWishlist(false)}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </div>
                  )}

                  {filteredProducts.length > 0 ? (
                    <div
                      className={cn(
                        "gap-6",
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                          : "grid grid-cols-1"
                      )}
                    >
                      {filteredProducts.map((product) => {
                        const productId = product.id.toString();
                        const productImage =
                          product.image ||
                          productImages[product.category] ||
                          productImages.default;
                        const badge =
                          product.badges && product.badges.length > 0
                            ? product.badges[0]
                            : undefined;

                        return (
                          <div
                            key={productId}
                            className={cn(
                              "group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500",
                              viewMode === "grid"
                                ? "hover:-translate-y-1"
                                : "lg:flex"
                            )}
                            onMouseEnter={() => setHoveredCard(productId)}
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            {badge && (
                              <div className="absolute top-4 left-4 z-20">
                                <Badge
                                  className={cn(
                                    "px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg",
                                    getBadgeVariant(badge),
                                    "text-white"
                                  )}
                                >
                                  {badge}
                                </Badge>
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "absolute top-4 right-4 z-20 bg-white/90 hover:bg-white rounded-full transition-all duration-300 w-9 h-9 shadow-sm",
                                wishlist.has(productId) &&
                                  "bg-pink-500 hover:bg-pink-600"
                              )}
                              onClick={() => toggleWishlist(productId)}
                            >
                              <Heart
                                className={cn(
                                  "h-4 w-4",
                                  wishlist.has(productId)
                                    ? "fill-current text-white"
                                    : "text-gray-600 group-hover:text-rose-500"
                                )}
                              />
                            </Button>

                            <div
                              className={cn(
                                "relative overflow-hidden",
                                viewMode === "grid"
                                  ? "h-48"
                                  : "lg:w-1/3 h-48 lg:h-auto"
                              )}
                            >
                              <img
                                src={productImage}
                                alt={product.name}
                                className={cn(
                                  "w-full h-full object-cover transition-transform duration-700",
                                  viewMode === "grid"
                                    ? "group-hover:scale-110"
                                    : "group-hover:scale-105"
                                )}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = productImages.default;
                                }}
                              />

                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all duration-500">
                                <Button
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                                  onClick={() => openQuickView(product)}
                                >
                                  <Eye className="mr-2 h-3 w-3" />
                                  Quick View
                                </Button>
                              </div>

                              {!product.inStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>

                            <div
                              className={cn(
                                "p-4 space-y-3",
                                viewMode === "list" && "lg:w-2/3 lg:p-6"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className="text-xs border-gray-200 text-gray-700"
                                >
                                  {product.category}
                                </Badge>
                                {product.inStock ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs text-emerald-600 font-medium">
                                      In Stock
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    Out of Stock
                                  </span>
                                )}
                              </div>

                              <h3
                                className={cn(
                                  "font-bold text-gray-900 group-hover:text-[#9902f7] transition-colors",
                                  viewMode === "grid"
                                    ? "text-base line-clamp-1"
                                    : "text-lg"
                                )}
                              >
                                {product.name}
                              </h3>

                              <p
                                className={cn(
                                  "text-gray-600",
                                  viewMode === "grid"
                                    ? "text-sm line-clamp-2"
                                    : "text-base"
                                )}
                              >
                                {product.description}
                              </p>

                              {product.rating && (
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < Math.floor(product.rating || 0)
                                            ? "text-amber-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {product.rating?.toFixed(1)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({product.reviews})
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2">
                                <div className="space-y-0.5">
                                  <span className="text-lg font-bold text-[#9902f7]">
                                    {formatPrice(product.price)}
                                  </span>
                                </div>

                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white hover:opacity-90 shadow-md"
                                  disabled={!product.inStock}
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <ShoppingCart className="h-3 w-3 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="max-w-md mx-auto">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No products found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Try adjusting your filters or search terms
                        </p>
                        <Button
                          onClick={clearAllFilters}
                          className="bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>

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

export default Shop;
