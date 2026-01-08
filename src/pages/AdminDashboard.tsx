// AdminDashboard.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  DollarSign,
  Package,
  Tag,
  Users,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  ShoppingBag,
  BookOpen,
  Bell,
  Settings,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
  TrendingUp,
  Activity,
  CreditCard,
  FileText,
  UserPlus,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Class,
  Product,
  Order,
  PromoCode,
  User,
  PaginatedResponse,
  apiService,
  AdminStats,
} from "@/services/api";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { format, isValid, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const [classes, setClasses] = useState<PaginatedResponse<Class>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    links: { first: "", last: "", prev: null, next: null },
  });
  const [products, setProducts] = useState<PaginatedResponse<Product>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    links: { first: "", last: "", prev: null, next: null },
  });
  const [orders, setOrders] = useState<PaginatedResponse<Order>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    links: { first: "", last: "", prev: null, next: null },
  });
  const [promoCodes, setPromoCodes] = useState<PaginatedResponse<PromoCode>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    links: { first: "", last: "", prev: null, next: null },
  });
  const [users, setUsers] = useState<PaginatedResponse<User>>({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    links: { first: "", last: "", prev: null, next: null },
  });
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classCategories, setClassCategories] = useState<string[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);

  // Form states
  const [showClassDialog, setShowClassDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    description: "",
    instructor: "",
    type: "virtual",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "18:00",
    duration: "60 mins",
    price: { naira: 0, usd: 0, gbp: 0 },
    category: "",
    spotsAvailable: 20,
  });

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: { naira: 0, usd: 0, gbp: 0 },
    image: "",
    category: "",
    inStock: true,
  });

  const [newPromo, setNewPromo] = useState<
    Omit<PromoCode, "id" | "usedCount" | "createdAt">
  >({
    code: "",
    discount: 0,
    type: "percentage",
    applicableTo: "all",
    expiresAt: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    usageLimit: 100,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        stats,
        classesData,
        productsData,
        ordersData,
        promosData,
        usersData,
      ] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getClassesPaginated(),
        apiService.getProductsPaginated(),
        apiService.getOrders(),
        apiService.getPromoCodes(),
        apiService.getUsers(),
      ]);

      setAdminStats(stats);
      setClasses(classesData);
      setProducts(productsData);
      setOrders(ordersData);
      setPromoCodes(promosData);
      setUsers(usersData);

      // Load categories
      const [classCats, productCats] = await Promise.all([
        apiService.getClassCategories(),
        apiService.getProductCategories(),
      ]);
      setClassCategories(classCats);
      setProductCategories(productCats);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setStatsLoading(true);
    try {
      const stats = await apiService.getAdminStats();
      setAdminStats(stats);
      toast({
        title: "Success",
        description: "Stats refreshed successfully",
      });
    } catch (error) {
      console.error("Failed to refresh stats:", error);
      toast({
        title: "Error",
        description: "Failed to refresh stats",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateClass = async () => {
    try {
      if (editingClass) {
        await apiService.updateClass(editingClass.id, newClass);
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      } else {
        await apiService.createClass(newClass);
        toast({
          title: "Success",
          description: "Class created successfully",
        });
      }
      setShowClassDialog(false);
      resetClassForm();
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save class",
        variant: "destructive",
      });
    }
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    setNewClass({
      name: classItem.name,
      description: classItem.description,
      instructor: classItem.instructor,
      type: classItem.type,
      date: classItem.date,
      time: classItem.time,
      duration: classItem.duration,
      price: classItem.price,
      category: classItem.category,
      spotsAvailable: classItem.spotsAvailable,
      image: classItem.image,
    });
    setShowClassDialog(true);
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await apiService.deleteClass(id);
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (editingProduct) {
        await apiService.updateProduct(editingProduct.id, newProduct);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await apiService.createProduct(newProduct);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      setShowProductDialog(false);
      resetProductForm();
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiService.deleteProduct(id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleCreatePromo = async () => {
    try {
      if (editingPromo && editingPromo.id) {
        await apiService.updatePromoCode(editingPromo.id, newPromo);
        toast({
          title: "Success",
          description: "Promo code updated successfully",
        });
      } else {
        await apiService.createPromoCode(newPromo);
        toast({
          title: "Success",
          description: "Promo code created successfully",
        });
      }
      setShowPromoDialog(false);
      resetPromoForm();
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save promo code",
        variant: "destructive",
      });
    }
  };

  const handleEditPromo = (promo: PromoCode) => {
    setEditingPromo(promo);
    setNewPromo({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      applicableTo: promo.applicableTo,
      expiresAt:
        promo.expiresAt ||
        format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      usageLimit: promo.usageLimit || 100,
    });
    setShowPromoDialog(true);
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;

    try {
      await apiService.deletePromoCode(id);
      toast({
        title: "Success",
        description: "Promo code deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete promo code",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (
    id: string,
    status: Order["status"]
  ) => {
    try {
      await apiService.updateOrderStatus(id, status);
      toast({
        title: "Success",
        description: "Order status updated",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    try {
      await apiService.updateUserRole(id, role);
      toast({
        title: "Success",
        description: "User role updated",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = async (page: number, type: string) => {
    try {
      switch (type) {
        case "classes": {
          const classesData = await apiService.getClassesPaginated(page);
          setClasses(classesData);
          break;
        }
        case "products": {
          const productsData = await apiService.getProductsPaginated(page);
          setProducts(productsData);
          break;
        }
        case "orders": {
          const ordersData = await apiService.getOrders(page);
          setOrders(ordersData);
          break;
        }
        case "promos": {
          const promosData = await apiService.getPromoCodes(page);
          setPromoCodes(promosData);
          break;
        }
        case "users": {
          const usersData = await apiService.getUsers(page);
          setUsers(usersData);
          break;
        }
        default:
          console.warn(`Unknown type: ${type}`);
      }
    } catch (error) {
      console.error("Failed to load page:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const resetClassForm = () => {
    setEditingClass(null);
    setNewClass({
      name: "",
      description: "",
      instructor: "",
      type: "virtual",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "18:00",
      duration: "60 mins",
      price: { naira: 0, usd: 0, gbp: 0 },
      category: "",
      spotsAvailable: 20,
    });
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: { naira: 0, usd: 0, gbp: 0 },
      image: "",
      category: "",
      inStock: true,
    });
  };

  const resetPromoForm = () => {
    setEditingPromo(null);
    setNewPromo({
      code: "",
      discount: 0,
      type: "percentage",
      applicableTo: "all",
      expiresAt: format(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      usageLimit: 100,
    });
  };

  const formatCurrency = (amount: number, currency: string = "₦") => {
    return `${currency}${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to safely format dates
  const safeFormatDate = (
    dateString: string,
    formatStr: string = "MMM dd, yyyy"
  ): string => {
    if (!dateString) return "N/A";

    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, formatStr);
      }
      // Try parsing as regular date string
      const dateObj = new Date(dateString);
      if (isValid(dateObj)) {
        return format(dateObj, formatStr);
      }
      return "Invalid Date";
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid Date";
    }
  };

  // Stats array with null safety
  const stats = [
    {
      label: "Total Revenue",
      value: adminStats
        ? `₦${(adminStats.totalRevenue || 0).toLocaleString()}`
        : "₦0",
      icon: DollarSign,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      change: "+12.5%",
    },
    {
      label: "Total Users",
      value: adminStats ? (adminStats.totalUsers || 0).toString() : "0",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      change: "+8.2%",
    },
    {
      label: "Active Classes",
      value: adminStats ? (adminStats.totalClasses || 0).toString() : "0",
      icon: CalendarIcon,
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      change: "+5.7%",
    },
    {
      label: "Total Products",
      value: adminStats ? (adminStats.totalProducts || 0).toString() : "0",
      icon: Package,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      change: "+3.4%",
    },
    {
      label: "Pending Orders",
      value: adminStats ? (adminStats.pendingOrders || 0).toString() : "0",
      icon: ShoppingBag,
      color: "bg-gradient-to-br from-yellow-500 to-amber-600",
      change: "-2.1%",
    },
    {
      label: "Active Subs",
      value: adminStats
        ? (adminStats.activeSubscriptions || 0).toString()
        : "0",
      icon: Bell,
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
      change: "+15.3%",
    },
  ];

  // Early return for loading state
  if (loading && activeTab === "overview") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="pt-32">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-12 w-64 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your entire fitness platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-64"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={refreshStats}
                disabled={statsLoading}
              >
                {statsLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs font-medium">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-x-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-7 p-1 min-w-max">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="classes"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Classes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <Package className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Products</span>
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <UsersIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger
                  value="promos"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Promos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=able]:to-pink-500 data-[state=active]:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {!adminStats ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Unable to load dashboard stats. Please try refreshing.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <Card className="p-6 lg:col-span-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Revenue Overview
                          </h3>
                          <p className="text-sm text-gray-600">
                            Monthly revenue trends
                          </p>
                        </div>
                        <Select defaultValue="monthly">
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                        <div className="text-center">
                          <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">
                            Total Revenue: ₦
                            {(adminStats.totalRevenue || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Revenue from completed orders
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            user: "John Doe",
                            action: "Purchased Zumba Class",
                            time: "10 min ago",
                            type: "purchase",
                          },
                          {
                            user: "Jane Smith",
                            action: "Joined Premium Membership",
                            time: "25 min ago",
                            type: "subscription",
                          },
                          {
                            user: "Bob Johnson",
                            action: "Created new account",
                            time: "1 hour ago",
                            type: "user",
                          },
                          {
                            user: "Alice Brown",
                            action: "Completed workout session",
                            time: "2 hours ago",
                            type: "activity",
                          },
                        ].map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.type === "purchase"
                                  ? "bg-green-100"
                                  : activity.type === "subscription"
                                  ? "bg-blue-100"
                                  : activity.type === "user"
                                  ? "bg-purple-100"
                                  : "bg-orange-100"
                              }`}
                            >
                              {activity.type === "purchase" && (
                                <ShoppingBag className="w-4 h-4 text-green-600" />
                              )}
                              {activity.type === "subscription" && (
                                <Bell className="w-4 h-4 text-blue-600" />
                              )}
                              {activity.type === "user" && (
                                <UserPlus className="w-4 h-4 text-purple-600" />
                              )}
                              {activity.type === "activity" && (
                                <Activity className="w-4 h-4 text-orange-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.user}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {activity.action}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {activity.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Quick Stats */}
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      Platform Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Class Attendance
                            </span>
                            <span className="text-sm font-semibold">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Product Sales
                            </span>
                            <span className="text-sm font-semibold">92%</span>
                          </div>
                          <Progress
                            value={92}
                            className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              User Growth
                            </span>
                            <span className="text-sm font-semibold">+24%</span>
                          </div>
                          <Progress
                            value={24}
                            className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Customer Satisfaction
                            </span>
                            <span className="text-sm font-semibold">4.8/5</span>
                          </div>
                          <Progress
                            value={96}
                            className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"
                          />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                        <Activity className="w-8 h-8 text-blue-600 mb-4" />
                        <p className="text-sm text-gray-700 mb-2">
                          Active sessions right now
                        </p>
                        <p className="text-2xl font-bold text-gray-900">42</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                        <CreditCard className="w-8 h-8 text-green-600 mb-4" />
                        <p className="text-sm text-gray-700 mb-2">
                          Today's revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₦245,800
                        </p>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes" className="animate-fade-in">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Manage Classes
                    </h3>
                    <p className="text-sm text-gray-600">
                      {classes?.meta?.total || 0} total classes
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none border-gray-300"
                      onClick={() => {
                        resetClassForm();
                        setShowClassDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Class
                    </Button>
                  </div>
                </div>

                {!classes?.data || classes.data.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No classes yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Get started by creating your first class
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => {
                        resetClassForm();
                        setShowClassDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Class
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Class</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Instructor
                            </TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Date & Time
                            </TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Spots
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classes.data.map((classItem) => (
                            <TableRow
                              key={classItem.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {classItem.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {classItem.category}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {classItem.instructor}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    classItem.type === "virtual"
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      : classItem.type === "in-person"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                  }
                                >
                                  {classItem.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div>
                                  <p className="text-sm">
                                    {safeFormatDate(classItem.date)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {classItem.time}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                ₦{classItem.price.naira.toLocaleString()}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        classItem.spotsAvailable > 10
                                          ? "bg-green-500"
                                          : classItem.spotsAvailable > 5
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${
                                          (classItem.spotsAvailable / 20) * 100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {classItem.spotsAvailable}/20
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleEditClass(classItem)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() =>
                                        handleDeleteClass(classItem.id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {classes?.meta && classes.meta.last_page > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="text-sm text-gray-600">
                          Showing {classes.meta.from || 0} to{" "}
                          {classes.meta.to || 0} of {classes.meta.total || 0}{" "}
                          classes
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={classes.meta.current_page === 1}
                            onClick={() =>
                              handlePageChange(
                                classes.meta.current_page - 1,
                                "classes"
                              )
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          {Array.from(
                            { length: Math.min(5, classes.meta.last_page) },
                            (_, i) => {
                              let pageNumber;
                              if (classes.meta.last_page <= 5) {
                                pageNumber = i + 1;
                              } else if (classes.meta.current_page <= 3) {
                                pageNumber = i + 1;
                              } else if (
                                classes.meta.current_page >=
                                classes.meta.last_page - 2
                              ) {
                                pageNumber = classes.meta.last_page - 4 + i;
                              } else {
                                pageNumber = classes.meta.current_page - 2 + i;
                              }
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    classes.meta.current_page === pageNumber
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handlePageChange(pageNumber, "classes")
                                  }
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              classes.meta.current_page ===
                              classes.meta.last_page
                            }
                            onClick={() =>
                              handlePageChange(
                                classes.meta.current_page + 1,
                                "classes"
                              )
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="animate-fade-in">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Manage Products
                    </h3>
                    <p className="text-sm text-gray-600">
                      {products?.meta?.total || 0} total products
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none border-gray-300"
                      onClick={() => {
                        resetProductForm();
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>

                {!products?.data || products.data.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No products yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start adding products to your store
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => {
                        resetProductForm();
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Product
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Category
                            </TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Created
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.data.map((product) => (
                            <TableRow
                              key={product.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {product.image && (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-10 h-10 rounded-lg object-cover"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {product.name}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate max-w-[200px]">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge
                                  variant="outline"
                                  className="border-gray-300"
                                >
                                  {product.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold">
                                ₦{product.price.naira.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {product.inStock ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Out of Stock
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {product.created_at &&
                                  safeFormatDate(product.created_at)}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {products?.meta && products.meta.last_page > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="text-sm text-gray-600">
                          Showing {products.meta.from || 0} to{" "}
                          {products.meta.to || 0} of {products.meta.total || 0}{" "}
                          products
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={products.meta.current_page === 1}
                            onClick={() =>
                              handlePageChange(
                                products.meta.current_page - 1,
                                "products"
                              )
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          {Array.from(
                            { length: Math.min(5, products.meta.last_page) },
                            (_, i) => {
                              let pageNumber;
                              if (products.meta.last_page <= 5) {
                                pageNumber = i + 1;
                              } else if (products.meta.current_page <= 3) {
                                pageNumber = i + 1;
                              } else if (
                                products.meta.current_page >=
                                products.meta.last_page - 2
                              ) {
                                pageNumber = products.meta.last_page - 4 + i;
                              } else {
                                pageNumber = products.meta.current_page - 2 + i;
                              }
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    products.meta.current_page === pageNumber
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handlePageChange(pageNumber, "products")
                                  }
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              products.meta.current_page ===
                              products.meta.last_page
                            }
                            onClick={() =>
                              handlePageChange(
                                products.meta.current_page + 1,
                                "products"
                              )
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="animate-fade-in">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Manage Orders
                    </h3>
                    <p className="text-sm text-gray-600">
                      {orders?.meta?.total || 0} total orders
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Select defaultValue="all">
                      <SelectTrigger className="flex-1 sm:flex-none">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!orders?.data || orders.data.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-600">
                      Orders will appear here when customers make purchases
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Customer
                            </TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Date
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.data.map((order) => (
                            <TableRow
                              key={order.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                #{order.id}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    User {order.userId}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.items.length} items
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {formatCurrency(order.total, order.currency)}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) =>
                                    handleUpdateOrderStatus(
                                      order.id,
                                      value as Order["status"]
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    className={`w-32 ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="shipped">
                                      Shipped
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                      Delivered
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Cancelled
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Completed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {safeFormatDate(order.createdAt)}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileText className="w-4 h-4 mr-2" />
                                      Invoice
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {orders?.meta && orders.meta.last_page > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="text-sm text-gray-600">
                          Showing {orders.meta.from || 0} to{" "}
                          {orders.meta.to || 0} of {orders.meta.total || 0}{" "}
                          orders
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={orders.meta.current_page === 1}
                            onClick={() =>
                              handlePageChange(
                                orders.meta.current_page - 1,
                                "orders"
                              )
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          {Array.from(
                            { length: Math.min(5, orders.meta.last_page) },
                            (_, i) => {
                              let pageNumber;
                              if (orders.meta.last_page <= 5) {
                                pageNumber = i + 1;
                              } else if (orders.meta.current_page <= 3) {
                                pageNumber = i + 1;
                              } else if (
                                orders.meta.current_page >=
                                orders.meta.last_page - 2
                              ) {
                                pageNumber = orders.meta.last_page - 4 + i;
                              } else {
                                pageNumber = orders.meta.current_page - 2 + i;
                              }
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    orders.meta.current_page === pageNumber
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handlePageChange(pageNumber, "orders")
                                  }
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              orders.meta.current_page === orders.meta.last_page
                            }
                            onClick={() =>
                              handlePageChange(
                                orders.meta.current_page + 1,
                                "orders"
                              )
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="animate-fade-in">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Manage Users
                    </h3>
                    <p className="text-sm text-gray-600">
                      {users?.meta?.total || 0} total users
                    </p>
                  </div>
                </div>

                {!users?.data || users.data.length === 0 ? (
                  <div className="text-center py-12">
                    <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No users yet
                    </h3>
                    <p className="text-gray-600">
                      Users will appear here when they register
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Email
                            </TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Joined
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.data.map((user) => (
                            <TableRow
                              key={user.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {user.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {user.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {user.phone || "No phone"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {user.email}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={user.role}
                                  onValueChange={(value) =>
                                    handleUpdateUserRole(user.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="instructor">
                                      Instructor
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {safeFormatDate(user.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Active
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Deactivate
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {users?.meta && users.meta.last_page > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="text-sm text-gray-600">
                          Showing {users.meta.from || 0} to {users.meta.to || 0}{" "}
                          of {users.meta.total || 0} users
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={users.meta.current_page === 1}
                            onClick={() =>
                              handlePageChange(
                                users.meta.current_page - 1,
                                "users"
                              )
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          {Array.from(
                            { length: Math.min(5, users.meta.last_page) },
                            (_, i) => {
                              let pageNumber;
                              if (users.meta.last_page <= 5) {
                                pageNumber = i + 1;
                              } else if (users.meta.current_page <= 3) {
                                pageNumber = i + 1;
                              } else if (
                                users.meta.current_page >=
                                users.meta.last_page - 2
                              ) {
                                pageNumber = users.meta.last_page - 4 + i;
                              } else {
                                pageNumber = users.meta.current_page - 2 + i;
                              }
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    users.meta.current_page === pageNumber
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handlePageChange(pageNumber, "users")
                                  }
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              users.meta.current_page === users.meta.last_page
                            }
                            onClick={() =>
                              handlePageChange(
                                users.meta.current_page + 1,
                                "users"
                              )
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* Promos Tab */}
            <TabsContent value="promos" className="animate-fade-in">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Manage Promo Codes
                    </h3>
                    <p className="text-sm text-gray-600">
                      {promoCodes?.meta?.total || 0} active promo codes
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => {
                        resetPromoForm();
                        setShowPromoDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Promo
                    </Button>
                  </div>
                </div>

                {!promoCodes?.data || promoCodes.data.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No promo codes yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your first promo code to boost sales
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => {
                        resetPromoForm();
                        setShowPromoDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Promo
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {promoCodes.data.map((promo) => (
                        <Card key={promo.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Badge className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                {promo.code}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                {promo.type === "percentage"
                                  ? `${promo.discount}% off`
                                  : `₦${promo.discount} off`}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditPromo(promo)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    promo.id && handleDeletePromo(promo.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Applicable to:
                              </span>
                              <span className="font-medium">
                                {promo.applicableTo}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Used:</span>
                              <span className="font-medium">
                                {promo.usedCount} / {promo.usageLimit || "∞"}
                              </span>
                            </div>
                            {promo.expiresAt && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Expires:</span>
                                <span className="font-medium">
                                  {safeFormatDate(promo.expiresAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {promoCodes?.meta && promoCodes.meta.last_page > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                          Showing {promoCodes.meta.from || 0} to{" "}
                          {promoCodes.meta.to || 0} of{" "}
                          {promoCodes.meta.total || 0} promos
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={promoCodes.meta.current_page === 1}
                            onClick={() =>
                              handlePageChange(
                                promoCodes.meta.current_page - 1,
                                "promos"
                              )
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          {Array.from(
                            { length: Math.min(5, promoCodes.meta.last_page) },
                            (_, i) => {
                              let pageNumber;
                              if (promoCodes.meta.last_page <= 5) {
                                pageNumber = i + 1;
                              } else if (promoCodes.meta.current_page <= 3) {
                                pageNumber = i + 1;
                              } else if (
                                promoCodes.meta.current_page >=
                                promoCodes.meta.last_page - 2
                              ) {
                                pageNumber = promoCodes.meta.last_page - 4 + i;
                              } else {
                                pageNumber =
                                  promoCodes.meta.current_page - 2 + i;
                              }
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    promoCodes.meta.current_page === pageNumber
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handlePageChange(pageNumber, "promos")
                                  }
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              promoCodes.meta.current_page ===
                              promoCodes.meta.last_page
                            }
                            onClick={() =>
                              handlePageChange(
                                promoCodes.meta.current_page + 1,
                                "promos"
                              )
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="animate-fade-in">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Settings
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        General Settings
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Maintenance Mode
                            </p>
                            <p className="text-sm text-gray-600">
                              Temporarily disable the platform
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Email Notifications
                            </p>
                            <p className="text-sm text-gray-600">
                              Send email updates to users
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Auto-approve Classes
                            </p>
                            <p className="text-sm text-gray-600">
                              Automatically approve new classes
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Payment Settings
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Enable Stripe
                            </p>
                            <p className="text-sm text-gray-600">
                              Accept credit card payments
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Enable PayPal
                            </p>
                            <p className="text-sm text-gray-600">
                              Accept PayPal payments
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Test Mode
                            </p>
                            <p className="text-sm text-gray-600">
                              Enable test payments
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Platform Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Platform Version
                        </p>
                        <p className="font-semibold text-gray-900">v2.1.0</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Database Size</p>
                        <p className="font-semibold text-gray-900">245 MB</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Class Dialog */}
      <Dialog open={showClassDialog} onOpenChange={setShowClassDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Edit Class" : "Create New Class"}
            </DialogTitle>
            <DialogDescription>
              {editingClass
                ? "Update the class details below."
                : "Fill in the details to create a new class."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  placeholder="e.g., Zumba Fitness"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  value={newClass.instructor}
                  onChange={(e) =>
                    setNewClass({ ...newClass, instructor: e.target.value })
                  }
                  placeholder="e.g., Dr. Blossom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newClass.description}
                onChange={(e) =>
                  setNewClass({ ...newClass, description: e.target.value })
                }
                placeholder="Describe the class..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newClass.type}
                  onValueChange={(value) =>
                    setNewClass({
                      ...newClass,
                      type: value as "virtual" | "in-person" | "hybrid",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newClass.category}
                  onValueChange={(value) =>
                    setNewClass({ ...newClass, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {classCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newClass.date}
                  onChange={(e) =>
                    setNewClass({ ...newClass, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newClass.time}
                  onChange={(e) =>
                    setNewClass({ ...newClass, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={newClass.duration}
                  onValueChange={(value) =>
                    setNewClass({ ...newClass, duration: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 mins">30 minutes</SelectItem>
                    <SelectItem value="45 mins">45 minutes</SelectItem>
                    <SelectItem value="60 mins">60 minutes</SelectItem>
                    <SelectItem value="90 mins">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spots">Available Spots</Label>
                <Input
                  id="spots"
                  type="number"
                  min="1"
                  max="100"
                  value={newClass.spotsAvailable}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      spotsAvailable: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                value={newClass.price?.naira || 0}
                onChange={(e) =>
                  setNewClass({
                    ...newClass,
                    price: {
                      naira: parseFloat(e.target.value),
                      usd: parseFloat(e.target.value) * 0.0013,
                      gbp: parseFloat(e.target.value) * 0.001,
                    },
                  })
                }
                placeholder="Enter price in Naira"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={handleCreateClass}
              disabled={!newClass.name || !newClass.instructor}
            >
              {editingClass ? "Update Class" : "Create Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the product details below."
                : "Fill in the details to create a new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name *</Label>
              <Input
                id="product-name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="e.g., Fitness Mat"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Describe the product..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Stock Status</Label>
                <Select
                  value={newProduct.inStock ? "inStock" : "outOfStock"}
                  onValueChange={(value) =>
                    setNewProduct({
                      ...newProduct,
                      inStock: value === "inStock",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inStock">In Stock</SelectItem>
                    <SelectItem value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-price">Price (₦)</Label>
              <Input
                id="product-price"
                type="number"
                value={newProduct.price?.naira || 0}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: {
                      naira: parseFloat(e.target.value),
                      usd: parseFloat(e.target.value) * 0.0013,
                      gbp: parseFloat(e.target.value) * 0.001,
                    },
                  })
                }
                placeholder="Enter price in Naira"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-image">Image URL (Optional)</Label>
              <Input
                id="product-image"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProductDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={handleCreateProduct}
              disabled={!newProduct.name}
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Dialog */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? "Edit Promo Code" : "Create New Promo Code"}
            </DialogTitle>
            <DialogDescription>
              {editingPromo
                ? "Update the promo code details below."
                : "Create a new promo code for discounts."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Promo Code *</Label>
              <Input
                id="promo-code"
                value={newPromo.code}
                onChange={(e) =>
                  setNewPromo({
                    ...newPromo,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g., SUMMER25"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Value *</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  value={newPromo.discount}
                  onChange={(e) =>
                    setNewPromo({
                      ...newPromo,
                      discount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="e.g., 20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={newPromo.type}
                  onValueChange={(value) =>
                    setNewPromo({
                      ...newPromo,
                      type: value as "percentage" | "fixed",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicableTo">Applicable To</Label>
              <Select
                value={newPromo.applicableTo}
                onValueChange={(value) =>
                  setNewPromo({
                    ...newPromo,
                    applicableTo: value as "all" | "class" | "product",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicable items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="class">Classes Only</SelectItem>
                  <SelectItem value="product">Products Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={newPromo.usageLimit}
                  onChange={(e) =>
                    setNewPromo({
                      ...newPromo,
                      usageLimit: parseInt(e.target.value),
                    })
                  }
                  placeholder="e.g., 100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiry Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={newPromo.expiresAt}
                  onChange={(e) =>
                    setNewPromo({ ...newPromo, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={handleCreatePromo}
              disabled={!newPromo.code || !newPromo.discount}
            >
              {editingPromo ? "Update Promo" : "Create Promo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
