import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Video,
  ShoppingBag,
  Clock,
  ExternalLink,
  User,
  Settings,
  Bell,
  Heart,
  TrendingUp,
  Award,
  Target,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Download,
  PlayCircle,
  BookOpen,
  Users,
  Star,
  Zap,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Edit,
  Shield,
  LogOut,
  Sparkles,
  BarChart3,
  Package,
  CalendarDays,
  Dumbbell,
  Music,
  Trophy,
  BellRing,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiService, PurchasedClass, Order } from "@/services/api";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const UserDashboard = () => {
  const [purchasedClasses, setPurchasedClasses] = useState<PurchasedClass[]>(
    []
  );
  const [upcomingClasses, setUpcomingClasses] = useState<PurchasedClass[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [userStats, setUserStats] = useState({
    totalClasses: 0,
    completedClasses: 0,
    streak: 0,
    points: 0,
    hours: 0,
  });

  const { user, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Mock data since API methods might not be implemented yet
      const mockPurchasedClasses: PurchasedClass[] = [
        {
          id: "1",
          classId: "ZUM101",
          userId: user?.id || "1",
          orderId: "ORD-001",
          purchasedAt: new Date().toISOString(),
          zoomLink: "https://zoom.us/j/123456789",
          status: "upcoming",
          title: "Zumba Fiesta",
          instructor: "Dr. Blossom",
          classDate: new Date(Date.now() + 86400000).toISOString(),
          duration: "60 min",
          type: "virtual",
        },
        {
          id: "2",
          classId: "HIIT202",
          userId: user?.id || "1",
          orderId: "ORD-002",
          purchasedAt: new Date(Date.now() - 86400000).toISOString(),
          zoomLink: "https://zoom.us/j/987654321",
          status: "completed",
          title: "HIIT Cardio Blast",
          instructor: "Dr. Blossom",
          classDate: new Date(Date.now() - 172800000).toISOString(),
          duration: "45 min",
          type: "in-person",
        },
      ];

      const mockOrders: Order[] = [
        {
          id: "ORD-001",
          userId: user?.id || "1",
          total: 45,
          status: "completed",
          currency: "usd",
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "1",
              orderId: "ORD-001",
              classId: "ZUM101",
              name: "Zumba Fiesta Class",
              price: 15,
              quantity: 1,
            },
            {
              id: "2",
              orderId: "ORD-001",
              classId: "HIIT202",
              name: "HIIT Cardio Blast",
              price: 20,
              quantity: 1,
            },
            {
              id: "3",
              orderId: "ORD-001",
              productId: "PROD-001",
              name: "Fitness Mat",
              price: 10,
              quantity: 1,
            },
          ],
        },
        {
          id: "ORD-002",
          userId: user?.id || "1",
          total: 30,
          status: "paid",
          currency: "usd",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          items: [
            {
              id: "4",
              orderId: "ORD-002",
              classId: "YOGA303",
              name: "Yoga & Mindfulness",
              price: 12,
              quantity: 1,
            },
            {
              id: "5",
              orderId: "ORD-002",
              productId: "PROD-002",
              name: "Water Bottle",
              price: 18,
              quantity: 1,
            },
          ],
        },
      ];

      // If you want to use real API calls later, uncomment these:
      // const classes = await apiService.getPurchasedClasses(user!.id.toString());
      // const userOrders = await apiService.getUserOrders(user!.id.toString());

      setPurchasedClasses(mockPurchasedClasses);
      setOrders(mockOrders);

      // Filter upcoming classes (within next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcoming = mockPurchasedClasses.filter((pc) => {
        if (!pc.classDate) return false;
        const classDate = new Date(pc.classDate);
        return (
          classDate >= today &&
          classDate <= nextWeek &&
          pc.status === "upcoming"
        );
      });

      setUpcomingClasses(upcoming);

      // Calculate user stats
      setUserStats({
        totalClasses: mockPurchasedClasses.length,
        completedClasses: mockPurchasedClasses.filter(
          (c) => c.status === "completed"
        ).length,
        streak: Math.floor(Math.random() * 30) + 1,
        points: mockPurchasedClasses.length * 100,
        hours: mockPurchasedClasses.reduce((sum, pc) => {
          const duration = parseInt(pc.duration?.match(/\d+/)?.[0] || "0");
          return sum + duration;
        }, 0),
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = (classItem: PurchasedClass) => {
    if (classItem.zoomLink) {
      window.open(classItem.zoomLink, "_blank");
    } else {
      toast({
        title: "Class Link Unavailable",
        description: "Please contact support for the class link",
        variant: "destructive",
      });
    }
  };

  const handleDownloadMaterials = (classItem: PurchasedClass) => {
    toast({
      title: "Materials Downloaded",
      description: `Class materials for ${classItem.title} have been downloaded successfully`,
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleSubscribeToClass = async (classId: string) => {
    try {
      // Make sure subscribeToClass method exists in apiService
      if (apiService.subscribeToClass) {
        await apiService.subscribeToClass(classId, user?.id);
        toast({
          title: "Success!",
          description: "You have successfully subscribed to the class",
        });
      } else {
        // Mock subscription for now
        toast({
          title: "Subscription Added",
          description: "Class has been added to your schedule",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe to class",
        variant: "destructive",
      });
    }
  };

  // Quick actions
  const quickActions = [
    {
      icon: PlayCircle,
      label: "Join Live Class",
      action: "/classes",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Calendar,
      label: "Book Class",
      action: "/classes",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShoppingBag,
      label: "Shop Now",
      action: "/shop",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BookOpen,
      label: "Learning Hub",
      action: "/resources",
      color: "from-orange-500 to-red-500",
    },
  ];

  // Recent activity
  const recentActivity = [
    { action: "Completed Zumba Class", time: "2 hours ago", icon: Trophy },
    { action: "Earned 100 points", time: "Yesterday", icon: Award },
    { action: "Streak extended to 7 days", time: "2 days ago", icon: Zap },
    { action: "New class booked", time: "3 days ago", icon: CalendarDays },
    { action: "Achievement unlocked", time: "5 days ago", icon: Star },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="pt-32">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100/30 to-white">
      <Header />

      {/* Dashboard Header */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user?.name?.split(" ")[0] || "Member"}!
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-white/20 text-white border-0">
                    <Trophy className="w-3 h-3 mr-1" />
                    Member Level: Gold
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                    {userStats.points} Points
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => (window.location.href = "/profile/edit")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <h3 className="font-bold text-gray-900 mb-4">
                  Your Fitness Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Weekly Goal</span>
                      <span className="text-sm font-semibold">
                        {userStats.completedClasses}/{userStats.totalClasses}{" "}
                        classes
                      </span>
                    </div>
                    <Progress
                      value={
                        (userStats.completedClasses /
                          Math.max(userStats.totalClasses, 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">
                        {userStats.streak}
                      </div>
                      <div className="text-xs text-gray-600">Day Streak</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">
                        {userStats.hours}
                      </div>
                      <div className="text-xs text-gray-600">Hours</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      onClick={() => (window.location.href = action.action)}
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${action.color} mr-3`}
                      >
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Recent Activity</h3>
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <activity.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs Navigation */}
              <Card className="p-2 mb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="classes"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      My Classes
                    </TabsTrigger>
                    <TabsTrigger
                      value="orders"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </Card>

              {/* Tab Contents */}
              <div className="space-y-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <>
                    {/* Welcome Banner */}
                    <Card className="overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <div className="p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">
                              Your Fitness Journey
                            </h2>
                            <p className="opacity-90">
                              Keep up the amazing work! You're on track for your
                              goals.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            onClick={() =>
                              (window.location.href = "/achievements")
                            }
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            View Achievements
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Upcoming Classes */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          Upcoming Classes
                        </h3>
                        <Button
                          variant="ghost"
                          className="text-purple-600 hover:text-purple-700"
                          onClick={() => setActiveTab("classes")}
                        >
                          View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingClasses.map((classItem) => (
                          <Card
                            key={classItem.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300"
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900">
                                    {classItem.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    with {classItem.instructor}
                                  </p>
                                </div>
                                <Badge className="bg-purple-100 text-purple-800 border-0">
                                  {classItem.type}
                                </Badge>
                              </div>
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center text-gray-600 text-sm">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {classItem.classDate
                                    ? new Date(
                                        classItem.classDate
                                      ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "Date TBD"}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {classItem.duration}
                                </div>
                              </div>
                              <Button
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                onClick={() => handleJoinClass(classItem)}
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Join Class
                              </Button>
                            </div>
                          </Card>
                        ))}
                        {upcomingClasses.length === 0 && (
                          <Card className="col-span-1 md:col-span-2 p-8 text-center">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                              No Upcoming Classes
                            </h4>
                            <p className="text-gray-600 mb-4">
                              You don't have any classes scheduled for the next
                              week.
                            </p>
                            <Button
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                              onClick={() =>
                                (window.location.href = "/classes")
                              }
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Book a Class
                            </Button>
                          </Card>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* My Classes Tab */}
                {activeTab === "classes" && (
                  <div className="space-y-6">
                    {/* Classes Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          My Classes
                        </h3>
                        <p className="text-gray-600">
                          {purchasedClasses.length} classes purchased
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search classes..."
                            className="pl-9 w-full md:w-64"
                          />
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                    </div>

                    {/* Classes Grid */}
                    {purchasedClasses.length === 0 ? (
                      <Card className="p-12 text-center">
                        <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">
                          No Classes Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Book your first class to start your fitness journey!
                        </p>
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          onClick={() => (window.location.href = "/classes")}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Browse Classes
                        </Button>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {purchasedClasses.map((pc) => (
                          <Card
                            key={pc.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300"
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900">
                                    {pc.title || `Class #${pc.classId}`}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      className={
                                        pc.status === "upcoming"
                                          ? "bg-blue-100 text-blue-800"
                                          : pc.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : pc.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {pc.status}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-gray-300"
                                    >
                                      {new Date(
                                        pc.purchasedAt
                                      ).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300"
                                    onClick={() => handleDownloadMaterials(pc)}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  {pc.status === "upcoming" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-gray-300"
                                      onClick={() =>
                                        window.open(pc.zoomLink, "_blank")
                                      }
                                    >
                                      <Video className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600 text-sm">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {pc.classDate
                                    ? new Date(pc.classDate).toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )
                                    : "Date TBD"}
                                </div>
                                {pc.duration && (
                                  <div className="flex items-center text-gray-600 text-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {pc.duration}
                                  </div>
                                )}
                                {pc.instructor && (
                                  <div className="flex items-center text-gray-600 text-sm">
                                    <User className="w-4 h-4 mr-2" />
                                    with {pc.instructor}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-3">
                                {pc.status === "upcoming" && pc.zoomLink && (
                                  <Button
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                    onClick={() => handleJoinClass(pc)}
                                  >
                                    <Video className="w-4 h-4 mr-2" />
                                    Join Class
                                  </Button>
                                )}
                                {pc.status === "completed" && (
                                  <Button
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                    onClick={() => handleDownloadMaterials(pc)}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Certificate
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  className="border-gray-300"
                                  onClick={() => handleDownloadMaterials(pc)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Materials
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    {/* Orders Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Order History
                        </h3>
                        <p className="text-gray-600">
                          {orders.length} orders total
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-300"
                        onClick={() => (window.location.href = "/shop")}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </div>

                    {orders.length === 0 ? (
                      <Card className="p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">
                          No Orders Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Your order history will appear here
                        </p>
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          onClick={() => (window.location.href = "/shop")}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Start Shopping
                        </Button>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card
                            key={order.id}
                            className="p-6 hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">
                                  Order #{order.id}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <Badge
                                    className={
                                      order.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "paid"
                                        ? "bg-blue-100 text-blue-800"
                                        : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : order.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatPrice(order.total)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {order.items.length} items
                                </div>
                              </div>
                            </div>

                            <Separator className="mb-4" />

                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">
                                Order Items
                              </h5>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                      </p>
                                      {item.classId && (
                                        <Badge className="mt-1 bg-purple-100 text-purple-800 border-0">
                                          Class
                                        </Badge>
                                      )}
                                      {item.productId && (
                                        <Badge className="mt-1 bg-blue-100 text-blue-800 border-0">
                                          Product
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-gray-900">
                                        {formatPrice(
                                          item.price * item.quantity
                                        )}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {formatPrice(item.price)} each
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                              <Button
                                variant="outline"
                                className="flex-1 border-gray-300"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-gray-300"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-gray-300"
                              >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Reorder
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <Card className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Profile Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-4">
                            Personal Details
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-600">
                                Full Name
                              </label>
                              <p className="font-medium text-gray-900">
                                {user?.name || "Not set"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">
                                Email
                              </label>
                              <p className="font-medium text-gray-900">
                                {user?.email}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">
                                Phone
                              </label>
                              <p className="font-medium text-gray-900">
                                {user?.phone || "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 mb-4">
                            Membership Details
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-600">
                                Member Since
                              </label>
                              <p className="font-medium text-gray-900">
                                {user?.createdAt
                                  ? new Date(
                                      user.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">
                                Membership Tier
                              </label>
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                                <Award className="w-3 h-3 mr-1" />
                                Gold Member
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">
                                Loyalty Points
                              </label>
                              <p className="font-medium text-gray-900">
                                {userStats.points} points
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-8" />

                      <div className="flex gap-3">
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          onClick={() =>
                            (window.location.href = "/profile/edit")
                          }
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          <Shield className="w-4 h-4 mr-2" />
                          Privacy Settings
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <Card className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Account Settings
                      </h3>

                      <div className="space-y-6">
                        {/* Notification Settings */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                            <BellRing className="w-5 h-5 mr-2 text-gray-600" />
                            Notification Preferences
                          </h4>
                          <div className="space-y-3">
                            {[
                              "Email notifications",
                              "SMS alerts",
                              "Push notifications",
                              "Marketing emails",
                            ].map((item) => (
                              <div
                                key={item}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="text-gray-900">{item}</span>
                                <Badge className="bg-green-100 text-green-800 border-0">
                                  Enabled
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Payment Methods */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                            Payment Methods
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                  <CreditCard className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Visa ending in 4242
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Expires 12/24
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800 border-0">
                                Default
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Danger Zone */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-4 text-red-600">
                            Danger Zone
                          </h4>
                          <div className="space-y-3">
                            <Button
                              variant="outline"
                              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                /* Handle delete */
                              }}
                            >
                              Delete Account
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                              onClick={handleLogout}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout from All Devices
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;
