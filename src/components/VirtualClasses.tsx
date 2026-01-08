import {
  Play,
  Clock,
  Users,
  Star,
  Calendar,
  Filter,
  Sparkles,
  TrendingUp,
  Zap,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { apiService, Class as ApiClass } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Import your local images
import blastImage from "@/assets/blossom-group1.jpg";
import yogaImage from "@/assets/blossom-group2.jpg";
import strengthImage from "@/assets/blossom-group3.jpg";
import danceImage from "@/assets/blossom-group4.jpg";
import pilatesImage from "@/assets/blossom-group5.jpg";
import boxingImage from "@/assets/blossom-group8.jpg";
import blossomSingleImage from "@/assets/blossom-single.jpg";
import blossomSingle2Image from "@/assets/blossom-single2.jpg";
import dance from "@/assets/dance-no-logo.jpg";

// Map of category to local images
const categoryImages: Record<string, string> = {
  HIIT: blastImage,
  Yoga: yogaImage,
  Strength: strengthImage,
  Cardio: dance,
  Pilates: pilatesImage,
  Boxing: boxingImage,
  Zumba: danceImage,
  Dance: danceImage,
  Fitness: blastImage,
  Seniors: yogaImage,
  default: blastImage,
};

// Map categories to difficulty levels
const categoryToDifficulty: Record<string, string> = {
  HIIT: "Advanced",
  Yoga: "Beginner",
  Strength: "Intermediate",
  Cardio: "All Levels",
  Pilates: "Intermediate",
  Boxing: "Advanced",
  Zumba: "All Levels",
  Dance: "All Levels",
  Fitness: "Intermediate",
  Seniors: "Beginner",
};

// Map API type to display text
const typeMap: Record<string, string> = {
  virtual: "Virtual",
  "in-person": "In-Person",
  hybrid: "Hybrid",
};

interface VirtualClass {
  id: number;
  title: string;
  instructor: string;
  duration: number;
  participants: number;
  rating: number;
  difficulty: string;
  type: string;
  schedule: string;
  thumbnail: string;
  price: { free: boolean; amount: number };
  category: string;
  description?: string;
  features?: string[];
}

const VirtualClasses = () => {
  const { isAuthenticated, user } = useAuth();
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch classes from API
      const apiClasses = await apiService.getClasses();
      console.log("API Classes received:", apiClasses);

      // Transform API classes to match your component's structure
      const transformedClasses: VirtualClass[] = apiClasses.map(
        (apiClass: ApiClass, index: number) => {
          const id =
            typeof apiClass.id === "string"
              ? parseInt(apiClass.id.replace(/\D/g, "")) || index + 1
              : typeof apiClass.id === "number"
              ? apiClass.id
              : index + 1;

          const category = apiClass.category || "Fitness";
          const nairaPrice = apiClass.price?.naira || 0;
          const usdPrice = apiClass.price?.usd || 0;
          const isFree = nairaPrice === 0 && usdPrice === 0;
          const baseParticipants = 100 + Math.floor(Math.random() * 200);
          const rating = 4.5 + Math.random() * 0.5;
          const thumbnail =
            categoryImages[category] || categoryImages["default"];

          // Format schedule
          let schedule = "Available Now";
          if (apiClass.date && apiClass.time) {
            try {
              const dateStr = apiClass.date;
              const timeStr = apiClass.time;
              const classDateTime = new Date(`${dateStr}T${timeStr}`);

              if (!isNaN(classDateTime.getTime())) {
                const today = new Date();
                const hour = classDateTime.getHours();
                const minute = classDateTime
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");
                const ampm = hour >= 12 ? "PM" : "AM";
                const displayHour = hour % 12 || 12;
                const formattedTime = `${displayHour}:${minute} ${ampm}`;

                if (classDateTime.toDateString() === today.toDateString()) {
                  schedule = `Today ${formattedTime}`;
                } else {
                  const days = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ];
                  const dayName = days[classDateTime.getDay()];
                  schedule = `${dayName} ${formattedTime}`;
                }
              }
            } catch (error) {
              console.error("Error formatting schedule:", error);
            }
          }

          // Determine difficulty
          const difficulty =
            categoryToDifficulty[category] ||
            ["Beginner", "Intermediate", "Advanced", "All Levels"][index % 4];

          // Parse duration
          let duration = 45;
          if (apiClass.duration) {
            const durationMatch = apiClass.duration.match(/(\d+)/);
            if (durationMatch) {
              duration = parseInt(durationMatch[1]);
            }
          }

          // Calculate price amount
          let priceAmount = isFree ? 0 : 15;
          if (!isFree) {
            if (usdPrice > 0) {
              priceAmount = usdPrice;
            } else if (nairaPrice > 0) {
              priceAmount = Math.round(nairaPrice * 0.0013);
            }
          }

          // Generate description and features
          const descriptions = [
            "Transform your fitness journey with high-energy sessions",
            "Experience the perfect blend of cardio and strength training",
            "Join our vibrant community for motivation and support",
            "Learn proper techniques from certified instructors",
            "Achieve your fitness goals with structured programs",
          ];

          const featuresList = [
            "Live Q&A Sessions",
            "Downloadable Resources",
            "Progress Tracking",
            "Community Access",
            "Certificate of Completion",
          ];

          return {
            id,
            title: apiClass.name || `Fitness Class ${id}`,
            instructor: apiClass.instructor || "Dr. Blossom Maduafokwa",
            duration,
            participants: baseParticipants,
            rating: parseFloat(rating.toFixed(1)),
            difficulty,
            type: apiClass.type || "virtual",
            schedule,
            thumbnail,
            price: {
              free: isFree,
              amount: priceAmount,
            },
            category,
            description: descriptions[index % descriptions.length],
            features: featuresList.slice(0, 3 + (index % 2)),
          };
        }
      );

      console.log("Transformed classes:", transformedClasses);
      setClasses(transformedClasses);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setError("Failed to load classes. Please try again later.");
      // Use mock data as fallback
      setClasses(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockData = (): VirtualClass[] => [
    {
      id: 1,
      title: "HIIT Blast Revolution",
      instructor: "Maya Rodriguez",
      duration: 45,
      participants: 234,
      rating: 4.9,
      difficulty: "Advanced",
      type: "virtual",
      schedule: "Today 6:00 PM",
      thumbnail: blastImage,
      price: { free: false, amount: 15 },
      category: "HIIT",
      description: "High-intensity interval training for maximum calorie burn",
      features: ["Live Q&A", "Workout Plan", "Nutrition Guide"],
    },
    {
      id: 2,
      title: "Zen Flow Yoga",
      instructor: "Sarah Chen",
      duration: 60,
      participants: 156,
      rating: 4.8,
      difficulty: "Beginner",
      type: "virtual",
      schedule: "Available Now",
      thumbnail: yogaImage,
      price: { free: true, amount: 0 },
      category: "Yoga",
      description: "Find balance and flexibility through mindful movement",
      features: ["Beginner Friendly", "Meditation Guide", "Flexibility Plan"],
    },
    {
      id: 3,
      title: "Beast Mode Strength",
      instructor: "Marcus Johnson",
      duration: 50,
      participants: 89,
      rating: 4.7,
      difficulty: "Intermediate",
      type: "in-person",
      schedule: "Tomorrow 7:30 AM",
      thumbnail: strengthImage,
      price: { free: false, amount: 20 },
      category: "Strength",
      description:
        "Build muscle and increase strength with progressive overload",
      features: ["Personalized Plan", "Form Check", "Equipment Guide"],
    },
    {
      id: 4,
      title: "Cardio Dance Fusion",
      instructor: "Lisa Thompson",
      duration: 40,
      participants: 312,
      rating: 4.9,
      difficulty: "All Levels",
      type: "hybrid",
      schedule: "Available Now",
      thumbnail: dance,
      price: { free: true, amount: 0 },
      category: "Cardio",
      description: "Dance your way to fitness with fun choreography",
      features: ["All Levels", "Fun Atmosphere", "Calorie Burn Focus"],
    },
    {
      id: 5,
      title: "Pilates Core Power",
      instructor: "Emma Davis",
      duration: 35,
      participants: 178,
      rating: 4.6,
      difficulty: "Intermediate",
      type: "virtual",
      schedule: "Wed 5:30 PM",
      thumbnail: pilatesImage,
      price: { free: false, amount: 12 },
      category: "Pilates",
      description: "Strengthen your core and improve posture",
      features: ["Core Focus", "Posture Correction", "Low Impact"],
    },
    {
      id: 6,
      title: "Boxing Bootcamp",
      instructor: "Jake Martinez",
      duration: 55,
      participants: 267,
      rating: 4.8,
      difficulty: "Advanced",
      type: "in-person",
      schedule: "Available Now",
      thumbnail: boxingImage,
      price: { free: false, amount: 18 },
      category: "Boxing",
      description: "Learn boxing techniques while getting an intense workout",
      features: ["Technique Training", "Cardio Focus", "Self Defense"],
    },
  ];

  // Handle class subscription
  const handleSubscribe = async (classItem: VirtualClass) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to classes",
        variant: "destructive",
      });
      window.location.href = `/login?redirect=/classes`;
      return;
    }

    try {
      // Call API to subscribe user to class
      const response = await apiService.subscribeToClass(
        classItem.id.toString(),
        user?.id
      );

      if (response.success) {
        toast({
          title: "🎉 Success!",
          description: `You've successfully subscribed to ${classItem.title}`,
        });

        // If paid class, redirect to payment
        if (!classItem.price.free) {
          window.location.href = `/payment?classId=${classItem.id}&amount=${classItem.price.amount}`;
        }
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Unable to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredClasses = classes.filter((classItem) => {
    if (filter === "all") return true;
    if (filter === "free") return classItem.price.free;
    if (filter === "virtual") return classItem.type === "virtual";
    if (filter === "in-person") return classItem.type === "in-person";
    if (filter === "hybrid") return classItem.type === "hybrid";
    return classItem.category.toLowerCase() === filter;
  });

  // Sort classes
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.participants - a.participants;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      case "price-low":
        return a.price.amount - b.price.amount;
      case "price-high":
        return b.price.amount - a.price.amount;
      default:
        return 0;
    }
  });

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-creamish/20 to-white">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50" />

          <div className="relative">
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Zumba® Experience
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Premium Zumba®
              <br />
              Classes & Videos
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              <h5 className="text-2xl font-black text-gray-800">
                Ready to start your Zumba® journey?
              </h5>
              <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Access world-class fitness instruction from anywhere. Join live
              sessions or train on-demand with Dr. Blossom Maduafokwa.
            </p>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">2.5K+</div>
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
                  <div className="text-3xl font-bold text-gray-900">4.9</div>
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
                  <div className="text-3xl font-bold text-gray-900">50+</div>
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
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Classes
              </h3>
            </div>

            <Tabs
              defaultValue="all"
              value={filter}
              onValueChange={setFilter}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:flex gap-2">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="free"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  Free
                </TabsTrigger>
                <TabsTrigger
                  value="virtual"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  Virtual
                </TabsTrigger>
                <TabsTrigger
                  value="in-person"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  In-Person
                </TabsTrigger>
                <TabsTrigger
                  value="hybrid"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  Hybrid
                </TabsTrigger>
                <TabsTrigger
                  value="zumba"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  Zumba
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sortedClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={classItem.thumbnail}
                  alt={classItem.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 font-semibold border-0">
                    {typeMap[classItem.type] || classItem.type}
                  </Badge>
                  {classItem.price.free && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-semibold">
                      FREE
                    </Badge>
                  )}
                </div>

                {/* Play Button */}
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-lg rounded-full p-5 border-4 border-white/30">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </button>

                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-black/70 backdrop-blur-sm text-white border-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {classItem.duration}min
                    </Badge>
                    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold text-sm">
                        {classItem.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category & Difficulty */}
                <div className="flex justify-between items-center mb-4">
                  <Badge
                    variant="outline"
                    className="text-purple-600 border-purple-200"
                  >
                    {classItem.category}
                  </Badge>
                  <Badge
                    className={`
                    ${
                      classItem.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      classItem.difficulty === "Intermediate"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                    ${
                      classItem.difficulty === "Advanced"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    ${
                      classItem.difficulty === "All Levels"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }
                    border-0 font-semibold
                  `}
                  >
                    {classItem.difficulty}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {classItem.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {classItem.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {classItem.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Instructor</div>
                    <div className="font-semibold text-gray-900">
                      {classItem.instructor}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Includes:</div>
                  <div className="flex flex-wrap gap-2">
                    {classItem.features?.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats & Schedule */}
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        {classItem.participants.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        {classItem.schedule}
                      </span>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    {classItem.price.free ? (
                      <div className="text-2xl font-bold text-green-600">
                        FREE
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${classItem.price.amount}
                        </div>
                        <div className="text-sm text-gray-500">
                          one-time payment
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSubscribe(classItem)}
                    className={`
                      px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${
                        classItem.price.free
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      }
                    `}
                  >
                    {classItem.price.free ? "Join Free Class" : "Subscribe Now"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Membership CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-12 text-center text-white mb-16">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Get Unlimited Access
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join our premium membership for unlimited classes, exclusive
              content, and personalized coaching from Dr. Blossom.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <CheckCircle className="w-8 h-8 mb-4 mx-auto text-green-300" />
                <div className="text-2xl font-bold">All Classes</div>
                <div className="text-sm opacity-80">Unlimited access</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <CheckCircle className="w-8 h-8 mb-4 mx-auto text-green-300" />
                <div className="text-2xl font-bold">Live Sessions</div>
                <div className="text-sm opacity-80">
                  Weekly with Dr. Blossom
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <CheckCircle className="w-8 h-8 mb-4 mx-auto text-green-300" />
                <div className="text-2xl font-bold">Community</div>
                <div className="text-sm opacity-80">Support & Motivation</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => (window.location.href = "/membership")}
              >
                View Membership Plans
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => (window.location.href = "/contact")}
              >
                Book Private Session
              </Button>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Start Your Journey Today
            </div>
            <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Transform Your Fitness Journey
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of members who have transformed their lives with our
            Zumba® classes. No experience needed — just bring your energy and
            enthusiasm!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
              onClick={() =>
                (window.location.href = isAuthenticated
                  ? "/dashboard"
                  : "/signup")
              }
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-bold rounded-xl"
              onClick={() => (window.location.href = "/classes")}
            >
              Browse All Classes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualClasses;
