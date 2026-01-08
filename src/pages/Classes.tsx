import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Star, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Award,
  Filter,
  Search,
  ChevronRight,
  Play,
  Heart,
  Share2,
  ShoppingCart,
  Tag
} from "lucide-react";
import { apiService, Class as ApiClass } from "@/services/api";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import heroBackground from "@/assets/Home-Hero-section.png";

// Import additional images
import classImage1 from "@/assets/blossom-group1.jpg";
import classImage2 from "@/assets/blossom-group2.jpg";
import classImage3 from "@/assets/blossom-group3.jpg";
import classImage4 from "@/assets/blossom-group4.jpg";

// Define a local class type that matches what we need
interface LocalClass {
  id: string;
  name: string;
  description: string;
  type: "virtual" | "in-person" | "hybrid";
  date: string;
  time: string;
  duration: string;
  spotsAvailable: number;
  price: {
    naira: number;
    usd: number;
    gbp: number;
  };
  category: string;
  instructor: string;
  level: string;
  location?: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<LocalClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<LocalClass[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { formatPrice, currency } = useCurrency();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Get random image for class card
  const getRandomClassImage = (index: number) => {
    const images = [classImage1, classImage2, classImage3, classImage4];
    return images[index % images.length];
  };

  // Helper function to convert ApiClass to LocalClass
  const convertToLocalClass = (apiClass: ApiClass): LocalClass => {
    return {
      id: apiClass.id,
      name: apiClass.name,
      description: apiClass.description || "Join this amazing fitness class",
      type: apiClass.type,
      date: apiClass.date,
      time: apiClass.time,
      duration: apiClass.duration,
      spotsAvailable: apiClass.spotsAvailable,
      price: {
        naira: Number(apiClass.price.naira) || 0,
        usd: Number(apiClass.price.usd) || 0,
        gbp: Number(apiClass.price.gbp) || 0
      },
      category: apiClass.category || "Fitness",
      instructor: apiClass.instructor || "Dr. Blossom",
      level: apiClass.level || "All Levels",
      location: apiClass.location
    };
  };

  // Fetch classes
  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getClasses();
      
      // Convert API classes to LocalClass format
      const processedData: LocalClass[] = data.map(convertToLocalClass);
      
      setClasses(processedData);
      setFilteredClasses(processedData);
    } catch (error) {
      console.error("Error loading classes:", error);
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      });
      // Use mock data as fallback with proper LocalClass format
      const mockData = getMockClasses().map(convertToLocalClass);
      setClasses(mockData);
      setFilteredClasses(mockData);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  // Mock data fallback - in ApiClass format
  const getMockClasses = (): ApiClass[] => [
    {
      id: "1",
      name: "Zumba Fiesta",
      description: "High-energy dance fitness party with Latin rhythms",
      type: "in-person",
      date: new Date().toISOString().split('T')[0],
      time: "18:00",
      duration: "60 minutes",
      spotsAvailable: 15,
      price: { naira: 5000, usd: 15, gbp: 12 },
      category: "Zumba",
      instructor: "Dr. Blossom",
      level: "All Levels",
      location: "Lagos Main Studio"
    },
    {
      id: "2",
      name: "Virtual Zumba Party",
      description: "Join from anywhere! Live-streamed dance session",
      type: "virtual",
      date: new Date().toISOString().split('T')[0],
      time: "19:30",
      duration: "45 minutes",
      spotsAvailable: 50,
      price: { naira: 3000, usd: 10, gbp: 8 },
      category: "Zumba",
      instructor: "Dr. Blossom",
      level: "Beginner"
    },
    {
      id: "3",
      name: "HIIT Cardio Blast",
      description: "High-intensity interval training for maximum burn",
      type: "in-person",
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: "07:00",
      duration: "30 minutes",
      spotsAvailable: 10,
      price: { naira: 6000, usd: 20, gbp: 16 },
      category: "HIIT",
      instructor: "Dr. Blossom",
      location: "Abuja Fitness Hub",
      level: "Advanced"
    },
    {
      id: "4",
      name: "Yoga & Mindfulness",
      description: "Restorative yoga session for mind-body connection",
      type: "hybrid",
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      time: "08:00",
      duration: "75 minutes",
      spotsAvailable: 20,
      price: { naira: 4000, usd: 12, gbp: 10 },
      category: "Yoga",
      instructor: "Dr. Blossom",
      location: "Virtual + Lagos Studio",
      level: "All Levels"
    },
    {
      id: "5",
      name: "Dance Cardio Fusion",
      description: "Fun dance routines mixing various styles",
      type: "in-person",
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      time: "17:00",
      duration: "50 minutes",
      spotsAvailable: 25,
      price: { naira: 4500, usd: 13, gbp: 11 },
      category: "Cardio",
      instructor: "Dr. Blossom",
      location: "Port Harcourt Center",
      level: "Intermediate"
    },
    {
      id: "6",
      name: "Senior Fitness",
      description: "Gentle movement classes for active seniors",
      type: "in-person",
      date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
      time: "10:00",
      duration: "40 minutes",
      spotsAvailable: 30,
      price: { naira: 3500, usd: 8, gbp: 6 },
      category: "Senior Fitness",
      instructor: "Dr. Blossom",
      location: "Lagos Main Studio",
      level: "Beginner"
    }
  ];

  // Calculate total bulk price - FIXED VERSION
  const totalBulkPrice = useMemo(() => {
    if (selectedClasses.length === 0) return 0;
    
    const total = selectedClasses.reduce((sum, classId) => {
      const classItem = classes.find(c => c.id === classId);
      if (!classItem) return sum;
      
      // Get price based on currency
      let price = 0;
      switch (currency) {
        case "₦":
          price = Number(classItem.price.naira);
          break;
        case "$":
          price = Number(classItem.price.usd);
          break;
        case "£":
          price = Number(classItem.price.gbp);
          break;
        default:
          price = Number(classItem.price.usd);
      }
      
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    
    return total;
  }, [selectedClasses, classes, currency]);

  // Calculate bulk discount
  const bulkDiscount = useMemo(() => {
    if (selectedClasses.length < 3) return 0;
    
    // Discount tiers
    if (selectedClasses.length >= 5) {
      return totalBulkPrice * 0.20; // 20% off for 5+ classes
    } else if (selectedClasses.length >= 3) {
      return totalBulkPrice * 0.10; // 10% off for 3-4 classes
    }
    return 0;
  }, [selectedClasses.length, totalBulkPrice]);

  // Calculate final price after discount
  const finalBulkPrice = useMemo(() => {
    return totalBulkPrice - bulkDiscount;
  }, [totalBulkPrice, bulkDiscount]);

  // Filter and sort classes
  useEffect(() => {
    let result = [...classes];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(cls => 
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "virtual") {
        result = result.filter(cls => cls.type === "virtual");
      } else if (activeTab === "in-person") {
        result = result.filter(cls => cls.type === "in-person");
      } else if (activeTab === "hybrid") {
        result = result.filter(cls => cls.type === "hybrid");
      } else if (activeTab === "free") {
        result = result.filter(cls => {
          let price = 0;
          switch (currency) {
            case "₦":
              price = Number(cls.price.naira);
              break;
            case "$":
              price = Number(cls.price.usd);
              break;
            case "£":
              price = Number(cls.price.gbp);
              break;
          }
          return price === 0;
        });
      } else {
        result = result.filter(cls => cls.category.toLowerCase() === activeTab);
      }
    }

    // Sort classes
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.spotsAvailable - a.spotsAvailable);
        break;
      case "price-low":
        result.sort((a, b) => {
          const priceA = currency === "₦" ? Number(a.price.naira) : 
                        currency === "£" ? Number(a.price.gbp) : Number(a.price.usd);
          const priceB = currency === "₦" ? Number(b.price.naira) : 
                        currency === "£" ? Number(b.price.gbp) : Number(b.price.usd);
          return priceA - priceB;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const priceA = currency === "₦" ? Number(a.price.naira) : 
                        currency === "£" ? Number(a.price.gbp) : Number(a.price.usd);
          const priceB = currency === "₦" ? Number(b.price.naira) : 
                        currency === "£" ? Number(b.price.gbp) : Number(b.price.usd);
          return priceB - priceA;
        });
        break;
      case "date":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      default:
        break;
    }

    setFilteredClasses(result);
  }, [classes, searchTerm, activeTab, sortBy, currency]);

  const toggleClassSelection = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const toggleFavorite = (classId: string) => {
    setFavorites((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handleBookClass = async (classItem: LocalClass) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book a class",
        variant: "destructive",
      });
      window.location.href = "/login";
      return;
    }

    try {
      // Use the API service to subscribe to class
      if (apiService.subscribeToClass) {
        await apiService.subscribeToClass(classItem.id, user?.id);
      }
      
      toast({
        title: "Class Booked!",
        description: `You've successfully booked ${classItem.name}`,
      });
      
      // Redirect to checkout for paid classes
      const price = currency === "₦" ? classItem.price.naira : 
                   currency === "£" ? classItem.price.gbp : classItem.price.usd;
      if (Number(price) > 0) {
        setTimeout(() => {
          window.location.href = `/checkout?classId=${classItem.id}`;
        }, 1000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "Unable to book class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkPurchase = () => {
    if (selectedClasses.length === 0) {
      toast({
        title: "No Classes Selected",
        description: "Please select at least one class",
        variant: "destructive",
      });
      return;
    }

    // Add selected classes to cart
    const selectedClassItems = classes.filter(c => selectedClasses.includes(c.id));
    
    // TODO: Implement bulk add to cart API call
    console.log("Bulk purchase items:", selectedClassItems);
    console.log("Total price:", finalBulkPrice);
    console.log("Discount:", bulkDiscount);
    
    toast({
      title: "Added to Cart!",
      description: `${selectedClasses.length} classes added to cart with ${
        bulkDiscount > 0 ? formatPrice(bulkDiscount) + ' discount applied!' : 'no discount.'
      }`,
    });
    
    // Redirect to checkout with selected class IDs
    const classIds = selectedClasses.join(',');
    window.location.href = `/checkout?classIds=${classIds}&total=${finalBulkPrice}&discount=${bulkDiscount}`;
  };

  const selectAllClasses = () => {
    if (selectedClasses.length === filteredClasses.length) {
      // If all are selected, deselect all
      setSelectedClasses([]);
    } else {
      // Select all filtered classes
      const allIds = filteredClasses.map(cls => cls.id);
      setSelectedClasses(allIds);
    }
  };

  // Get unique categories
  const categories = [...new Set(classes.map(c => c.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-creamish/30">
        <Header />
        <div className="pt-32">
          <div className="container mx-auto px-4">
            <Skeleton className="h-16 w-64 mx-auto mb-8" />
            <Skeleton className="h-6 w-96 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-[500px] rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-creamish/30">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-black/50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Fitness Experience
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white">
              Transform Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fitness Journey</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join Dr. Blossom and discover the joy of dance fitness with our 
              high-energy Zumba classes, personalized training, and vibrant community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
                onClick={() => window.location.href = '#classes-grid'}
              >
                <Play className="w-5 h-5 mr-2" />
                Browse Classes
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => window.location.href = '/contact'}
              >
                Book Private Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20" id="classes-grid">
        <div className="container mx-auto px-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2.5K+</div>
                  <div className="text-sm text-gray-500">Active Members</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <Star className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-500">Avg Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-500">Classes</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mb-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search classes, instructors, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="date">Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:flex gap-2">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  All Classes
                </TabsTrigger>
                <TabsTrigger value="virtual" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  Virtual
                </TabsTrigger>
                <TabsTrigger value="in-person" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  In-Person
                </TabsTrigger>
                <TabsTrigger value="hybrid" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  Hybrid
                </TabsTrigger>
                <TabsTrigger value="free" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  Free Classes
                </TabsTrigger>
                {categories.slice(0, 3).map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Bulk Purchase Banner - IMPROVED */}
          {selectedClasses.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <ShoppingCart className="w-6 h-6" />
                    <h3 className="text-xl font-bold">
                      {selectedClasses.length} class{selectedClasses.length > 1 ? "es" : ""} selected
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={selectAllClasses}
                    >
                      {selectedClasses.length === filteredClasses.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-white/90">Subtotal:</span>
                      <span className="text-xl font-bold">{formatPrice(totalBulkPrice)}</span>
                    </div>
                    
                    {bulkDiscount > 0 && (
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4" />
                        <span className="text-white/90">Bulk Discount ({selectedClasses.length >= 5 ? '20%' : '10%'}):</span>
                        <span className="text-xl font-bold text-green-300">-{formatPrice(bulkDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex items-center gap-3">
                        <span className="text-white/90">Final Price:</span>
                        <span className="text-2xl font-bold">{formatPrice(finalBulkPrice)}</span>
                      </div>
                      <p className="text-white/80 text-sm mt-1">
                        Save {formatPrice(bulkDiscount)} by booking {selectedClasses.length} classes together!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold min-w-[180px]"
                    onClick={handleBulkPurchase}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Purchase Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 font-bold"
                    onClick={() => setSelectedClasses([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredClasses.map((classItem, index) => {
              const isFavorite = favorites.includes(classItem.id);
              const isSelected = selectedClasses.includes(classItem.id);
              const classPrice = currency === "₦" 
                ? Number(classItem.price.naira) 
                : currency === "£"
                ? Number(classItem.price.gbp)
                : Number(classItem.price.usd);
              const isFree = classPrice === 0;

              return (
                <div
                  key={classItem.id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                    isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-100'
                  } hover:border-purple-300`}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={getRandomClassImage(index)}
                      alt={classItem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Top Actions */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 font-semibold border-0">
                        {classItem.type === "virtual" ? "Virtual" : 
                         classItem.type === "hybrid" ? "Hybrid" : "In-Person"}
                      </Badge>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(classItem.id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price Tag */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                        {isFree ? "FREE" : formatPrice(classPrice)}
                      </div>
                    </div>
                    
                    {/* Checkbox for selection */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleClassSelection(classItem.id)}
                          className="border-2 border-white data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <span className="text-white text-sm font-medium">Select for bulk</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category & Level */}
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {classItem.category}
                      </Badge>
                      <Badge className={`
                        ${classItem.level === 'Beginner' ? 'bg-green-100 text-green-800' : ''}
                        ${classItem.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : ''}
                        ${classItem.level === 'Advanced' ? 'bg-red-100 text-red-800' : ''}
                        ${classItem.level === 'All Levels' ? 'bg-purple-100 text-purple-800' : ''}
                        border-0 font-semibold
                      `}>
                        {classItem.level}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {classItem.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {classItem.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        {classItem.type === "virtual" ? (
                          <Video className="w-4 h-4 mr-3 text-purple-500" />
                        ) : (
                          <MapPin className="w-4 h-4 mr-3 text-purple-500" />
                        )}
                        <span className="text-sm">
                          {classItem.type === "virtual" ? "Virtual Class" : 
                           classItem.location || "Location TBA"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                        <span className="text-sm">
                          {new Date(classItem.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {classItem.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-3 text-purple-500" />
                          <span className="text-sm">{classItem.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="text-sm font-semibold">
                            {classItem.spotsAvailable} spots left
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {isFree ? "FREE" : formatPrice(classPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {isSelected ? "Selected for bulk purchase" : "per session"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => window.location.href = `/classes/${classItem.id}`}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className={`
                            ${isFree 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            }
                          `}
                          onClick={() => handleBookClass(classItem)}
                          disabled={classItem.spotsAvailable === 0}
                        >
                          {classItem.spotsAvailable === 0 ? "Sold Out" : 
                           isFree ? "Join Free" : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredClasses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No classes found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                View All Classes
              </Button>
            </div>
          )}

          {/* Membership CTA */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-12 text-center border border-purple-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Want Unlimited Access?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get access to all classes, exclusive content, and personalized coaching 
              with our premium membership plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
                onClick={() => window.location.href = '/membership'}
              >
                View Membership Plans
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => window.location.href = '/contact'}
              >
                Contact for Corporate
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Classes;