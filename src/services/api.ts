import api from "@/lib/axios";

// Define interfaces for Laravel data
interface LaravelClass {
  id: number;
  name: string;
  description: string;
  instructor: string;
  type: "virtual" | "in-person" | "hybrid";
  date: string;
  time: string;
  duration: string;
  price: number;
  price_naira?: number;
  price_usd?: number;
  price_gbp?: number;
  capacity?: number;
  booked_spots?: number;
  image?: string;
  images?: string[];
  zoom_link?: string;
  category: string;
}

interface LaravelOrder {
  id: number;
  user_id?: number;
  order_number: string;
  total: number;
  currency: string;
  status: string;
  created_at: string;
  payment_method?: string;
  items?: LaravelOrderItem[];
}

interface LaravelOrderItem {
  id: number;
  type: string;
  item_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface LaravelPurchasedClass {
  id: number;
  user_id?: number;
  class_id?: number;
  fitness_class_id?: number;
  order_id?: number;
  zoom_link?: string;
  purchased_at?: string;
  created_at?: string;
  attended?: boolean;
}

// Add these interfaces to your existing api.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category: string;
  read_time: number;
  views: number;
  tags: string[];
  published_at: string;
  created_at: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  subscription_type: string;
  created_at: string;
}

// Frontend interfaces
export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  type: "virtual" | "in-person" | "hybrid";
  date: string;
  time: string;
  duration: string;
  price: { usd: number; naira: number; gbp: number };
  spotsAvailable: number;
  image?: string;
  images?: string[];
  zoomLink?: string;
  category: string;
  level?: string;
  location?: string;
}

// In your services/api.ts file, update the Product interface:
export interface Product {
  id: string;
  name: string;
  description: string;
  price: { usd: number; naira: number; gbp: number };
  image: string;
  images?: string[];
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  badges?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "completed";
  createdAt: string;
  paymentMethod?: string;
}

export interface OrderItem {
  id: string;
  type: "class" | "product";
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PromoCode {
  id?: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  applicableTo: "all" | "class" | "product";
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  createdAt?: string;
}

export interface PurchasedClass {
  id: string;
  userId: string;
  classId: string;
  orderId: string;
  zoomLink: string;
  purchasedAt: string;
  attended: boolean;
  title?: string;
  instructor?: string;
  classDate?: string;
  duration?: string;
  type?: string;
  thumbnail?: string;
  status?: "active" | "completed" | "cancelled" | "upcoming";
}

// Admin interfaces
export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  totalClasses: number;
  totalProducts: number;
  activeSubscriptions: number;
  pendingOrders: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Helper function to convert any value to string safely
const safeToString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    // Try to extract meaningful string from object
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === "string") return obj.name;
    if (typeof obj.title === "string") return obj.title;
    if (typeof obj.category === "string") return obj.category;
    if (typeof obj.label === "string") return obj.label;
    // Fallback to JSON string
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return String(value);
};

// Type guards
function isLaravelClass(data: unknown): data is LaravelClass {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "type" in data
  );
}

function isLaravelOrder(data: unknown): data is LaravelOrder {
  return typeof data === "object" && data !== null && "id" in data;
}

function isLaravelPurchasedClass(data: unknown): data is LaravelPurchasedClass {
  return typeof data === "object" && data !== null && "id" in data;
}

// Conversion functions
const convertLaravelClass = (laravelClass: LaravelClass): Class => ({
  id: laravelClass.id.toString(),
  name: laravelClass.name,
  description: laravelClass.description,
  instructor: laravelClass.instructor,
  type: laravelClass.type,
  date: laravelClass.date,
  time: laravelClass.time,
  duration: laravelClass.duration,
  price: {
    naira: laravelClass.price_naira || laravelClass.price,
    usd: laravelClass.price_usd || laravelClass.price * 0.0013,
    gbp: laravelClass.price_gbp || laravelClass.price * 0.001,
  },
  spotsAvailable:
    (laravelClass.capacity || 0) - (laravelClass.booked_spots || 0),
  image: laravelClass.image,
  images: laravelClass.images,
  zoomLink: laravelClass.zoom_link,
  category: laravelClass.category,
});

const convertLaravelOrder = (laravelOrder: LaravelOrder): Order => ({
  id: laravelOrder.id.toString(),
  userId: laravelOrder.user_id?.toString() || "user-1",
  items: (laravelOrder.items || []).map((item) => ({
    id: item.id.toString(),
    type: item.type as "class" | "product",
    itemId: item.item_id.toString(),
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
  total: laravelOrder.total,
  currency: laravelOrder.currency || "₦",
  status: laravelOrder.status as Order["status"],
  createdAt: laravelOrder.created_at,
  paymentMethod: laravelOrder.payment_method,
});

const convertLaravelPurchasedClass = (
  laravelPurchased: LaravelPurchasedClass
): PurchasedClass => ({
  id: laravelPurchased.id.toString(),
  userId: laravelPurchased.user_id?.toString() || "user-1",
  classId:
    laravelPurchased.class_id?.toString() ||
    laravelPurchased.fitness_class_id?.toString() ||
    "",
  orderId: laravelPurchased.order_id?.toString() || "",
  zoomLink:
    laravelPurchased.zoom_link ||
    `https://zoom.us/j/class-${laravelPurchased.class_id}`,
  purchasedAt:
    laravelPurchased.purchased_at || laravelPurchased.created_at || "",
  attended: laravelPurchased.attended || false,
});

// Mock data
const mockClasses: Class[] = [
  {
    id: "c1",
    name: "High-Energy Zumba®",
    description: "Dance your way to fitness with Dr. Blossom",
    instructor: "Dr. Blossom Maduafokwa",
    type: "virtual",
    date: "2025-01-15",
    time: "18:00",
    duration: "60 mins",
    price: { naira: 3000, usd: 25, gbp: 20 },
    spotsAvailable: 12,
    category: "Fitness",
    level: "All Levels",
  },
  {
    id: "c2",
    name: "Zumba® Gold (Seniors)",
    description: "Low-impact Zumba® for mature participants",
    instructor: "Dr. Blossom Maduafokwa",
    type: "in-person",
    date: "2025-01-16",
    time: "10:00",
    duration: "45 mins",
    price: { naira: 2500, usd: 20, gbp: 15 },
    spotsAvailable: 8,
    category: "Seniors",
    level: "Beginner",
  },
];

// Mock data for fallback
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pro Performance Whey",
    description: "Premium whey protein for muscle building and recovery",
    price: { usd: 49.99, naira: 24999, gbp: 39.99 },
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
    category: "Supplements",
    inStock: true,
  },
  {
    id: "2",
    name: "Wireless Earbuds Pro",
    description: "High-quality wireless earbuds with noise cancellation",
    price: { usd: 89.99, naira: 44999, gbp: 69.99 },
    image:
      "https://images.unsplash.com/photo-1583623051567-ac3532c8fb83?w=400&h=400&fit=crop",
    category: "Tech",
    inStock: true,
  },
  {
    id: "3",
    name: "Resistance Band Set",
    description: "Complete resistance training system for home workouts",
    price: { usd: 29.99, naira: 14999, gbp: 24.99 },
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
    category: "Equipment",
    inStock: true,
  },
  {
    id: "4",
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracking with heart rate monitoring",
    price: { usd: 199.99, naira: 99999, gbp: 159.99 },
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    category: "Tech",
    inStock: true,
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    description: "Eco-friendly yoga mat with superior grip and cushioning",
    price: { usd: 59.99, naira: 29999, gbp: 49.99 },
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    category: "Equipment",
    inStock: true,
  },
  {
    id: "6",
    name: "Pre-Workout Energy",
    description: "Clean energy boost for intense workout sessions",
    price: { usd: 39.99, naira: 19999, gbp: 32.99 },
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    category: "Supplements",
    inStock: true,
  },
];

// Define response interfaces for API calls
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CreateClassResponse {
  id: number;
  name: string;
  description: string;
  instructor: string;
  type: "virtual" | "in-person" | "hybrid";
  date: string;
  time: string;
  duration: string;
  price: number;
  price_naira?: number;
  price_usd?: number;
  price_gbp?: number;
  capacity?: number;
  booked_spots?: number;
  image?: string;
  zoom_link?: string;
  category: string;
}

interface NewsletterResponseData {
  subscription: NewsletterSubscription;
  subscriber_count: number;
}

// Payment interfaces
export interface PaymentInitResponse {
  success: boolean;
  authorization_url?: string;
  reference?: string;
  access_code?: string;
  message?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status: "success" | "failed" | "pending";
  message?: string;
  data?: {
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string;
  };
}

// API service functions
export const apiService = {
  async getClasses(): Promise<Class[]> {
    try {
      const response = await api.get<ApiResponse<LaravelClass[]>>("/classes");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data
          .filter(isLaravelClass)
          .map(convertLaravelClass);
      }
      return mockClasses;
    } catch (error) {
      console.error("API Error:", error);
      return mockClasses;
    }
  },

  async getClassById(id: string): Promise<Class | null> {
    try {
      const response = await api.get<ApiResponse<LaravelClass>>(
        `/classes/${id}`
      );
      if (response.data.success && isLaravelClass(response.data.data)) {
        return convertLaravelClass(response.data.data);
      }
      return mockClasses.find((c) => c.id === id) || null;
    } catch (error) {
      console.error("API Error:", error);
      return mockClasses.find((c) => c.id === id) || null;
    }
  },

  async createClass(classData: Partial<Class>): Promise<Class> {
    try {
      const response = await api.post<ApiResponse<CreateClassResponse>>(
        "/admin/classes",
        {
          name: classData.name,
          description: classData.description,
          instructor: classData.instructor,
          type: classData.type,
          date: classData.date,
          time: classData.time,
          duration: classData.duration,
          price: classData.price?.naira || classData.price?.usd || 0,
          price_naira: classData.price?.naira,
          price_usd: classData.price?.usd,
          price_gbp: classData.price?.gbp,
          capacity: classData.spotsAvailable || 20,
          image: classData.image,
          images: classData.images,
          zoom_link: classData.zoomLink,
          category: classData.category,
          level: classData.level,
          location: classData.location,
        }
      );

      if (response.data.success) {
        return convertLaravelClass(response.data.data);
      }
      throw new Error("Failed to create class");
    } catch (error) {
      console.error("API Error:", error);
      const newClass: Class = {
        id: `class-${Date.now()}`,
        name: classData.name || "New Class",
        description: classData.description || "",
        instructor: classData.instructor || "Dr. Blossom",
        type: classData.type || "virtual",
        date: classData.date || new Date().toISOString().split("T")[0],
        time: classData.time || "10:00",
        duration: classData.duration || "60 mins",
        price: classData.price || { naira: 0, usd: 0, gbp: 0 },
        spotsAvailable: classData.spotsAvailable || 20,
        category: classData.category || "Fitness",
        image: classData.image,
        zoomLink: classData.zoomLink,
      };
      return newClass;
    }
  },

  async updateClass(id: string, classData: Partial<Class>): Promise<Class> {
    try {
      const response = await api.put<ApiResponse<CreateClassResponse>>(
        `/admin/classes/${id}`,
        {
          name: classData.name,
          description: classData.description,
          instructor: classData.instructor,
          type: classData.type,
          date: classData.date,
          time: classData.time,
          duration: classData.duration,
          price: classData.price?.naira || classData.price?.usd || 0,
          price_naira: classData.price?.naira,
          price_usd: classData.price?.usd,
          price_gbp: classData.price?.gbp,
          capacity: classData.spotsAvailable || 20,
          image: classData.image,
          images: classData.images,
          zoom_link: classData.zoomLink,
          category: classData.category,
          level: classData.level,
          location: classData.location,
        }
      );

      if (response.data.success) {
        return convertLaravelClass(response.data.data);
      }
      throw new Error("Failed to update class");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async deleteClass(id: string): Promise<void> {
    try {
      await api.delete(`/admin/classes/${id}`);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const laravelOrder = {
        user_id: orderData.userId
          ? parseInt(orderData.userId.replace("user-", ""))
          : null,
        items: orderData.items?.map((item) => ({
          type: item.type,
          item_id: parseInt(item.itemId),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: orderData.total,
        currency: orderData.currency,
        status: "pending",
      };

      const response = await api.post<ApiResponse<LaravelOrder>>(
        "/orders",
        laravelOrder
      );

      if (response.data.success && isLaravelOrder(response.data.data)) {
        return convertLaravelOrder(response.data.data);
      }

      throw new Error("Failed to create order");
    } catch (error) {
      console.error("API Error:", error);
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        userId: orderData.userId || "guest",
        items: orderData.items || [],
        total: orderData.total || 0,
        currency: orderData.currency || "₦",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      return newOrder;
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await api.get<ApiResponse<LaravelOrder[]>>(
        "/dashboard/orders"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data
          .filter(isLaravelOrder)
          .map(convertLaravelOrder);
      }
      return [];
    } catch (error) {
      console.error("API Error:", error);
      const orders = localStorage.getItem(`orders_${userId}`);
      return orders ? JSON.parse(orders) : [];
    }
  },

  async getOrders(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<Order>> {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<LaravelOrder>>
      >(`/admin/orders?page=${page}&per_page=${perPage}`);

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          data: response.data.data.data
            .filter(isLaravelOrder)
            .map(convertLaravelOrder),
        };
      }

      throw new Error("Failed to get orders");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          from: 0,
          to: 0,
        },
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      };
    }
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    try {
      const response = await api.patch<ApiResponse<LaravelOrder>>(
        `/admin/orders/${id}/status`,
        { status }
      );
      if (response.data.success && isLaravelOrder(response.data.data)) {
        return convertLaravelOrder(response.data.data);
      }
      throw new Error("Failed to update order status");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async validatePromoCode(code: string): Promise<PromoCode | null> {
    try {
      const response = await api.get<ApiResponse<PromoCode>>(
        `/promo-codes/validate/${code}`
      );
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("API Error:", error);
      const promoCodes = localStorage.getItem("promoCodes");
      const codes: PromoCode[] = promoCodes ? JSON.parse(promoCodes) : [];
      return codes.find((p) => p.code === code) || null;
    }
  },

  async getPromoCodes(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<PromoCode>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<PromoCode>>>(
        `/admin/promo-codes?page=${page}&per_page=${perPage}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error("Failed to get promo codes");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          from: 0,
          to: 0,
        },
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      };
    }
  },

  async createPromoCode(
    promoData: Omit<PromoCode, "id" | "usedCount">
  ): Promise<PromoCode> {
    try {
      const response = await api.post<ApiResponse<PromoCode>>(
        "/admin/promo-codes",
        promoData
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to create promo code");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async updatePromoCode(
    id: string,
    promoData: Partial<PromoCode>
  ): Promise<PromoCode> {
    try {
      const response = await api.put<ApiResponse<PromoCode>>(
        `/admin/promo-codes/${id}`,
        promoData
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to update promo code");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async deletePromoCode(id: string): Promise<void> {
    try {
      await api.delete(`/admin/promo-codes/${id}`);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async getPurchasedClasses(userId: string): Promise<PurchasedClass[]> {
    try {
      const response = await api.get<ApiResponse<LaravelPurchasedClass[]>>(
        "/dashboard/classes"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data
          .filter(isLaravelPurchasedClass)
          .map(convertLaravelPurchasedClass);
      }
      return [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  async subscribeToClass(
    classId: string,
    userId?: string | number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post<
        ApiResponse<{ success: boolean; message?: string }>
      >("/classes/subscribe", {
        class_id: classId,
        user_id: userId,
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: "Subscription failed" };
    } catch (error) {
      console.error("API Error:", error);
      return { success: true, message: "Added to subscription list" };
    }
  },

  async getClassesPaginated(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<Class>> {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<LaravelClass>>
      >(`/admin/classes?page=${page}&per_page=${perPage}`);

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          data: response.data.data.data
            .filter(isLaravelClass)
            .map(convertLaravelClass),
        };
      }

      throw new Error("Failed to get classes");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: mockClasses,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: mockClasses.length,
          from: 1,
          to: mockClasses.length,
        },
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      };
    }
  },

  // Product methods
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>("/products");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return mockProducts;
    } catch (error) {
      console.error("API Error:", error);
      return mockProducts;
    }
  },

  async getProductsPaginated(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
        `/admin/products?page=${page}&per_page=${perPage}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error("Failed to get products");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: mockProducts,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: mockProducts.length,
          from: 1,
          to: mockProducts.length,
        },
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      };
    }
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post<ApiResponse<Product>>(
        "/admin/products",
        productData
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to create product");
    } catch (error) {
      console.error("API Error:", error);
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || "New Product",
        description: productData.description || "",
        price: productData.price || { naira: 0, usd: 0, gbp: 0 },
        image: productData.image || "",
        images: productData.images,
        category: productData.category || "General",
        inStock: productData.inStock ?? true,
      };
      return newProduct;
    }
  },

  async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product> {
    try {
      const response = await api.put<ApiResponse<Product>>(
        `/admin/products/${id}`,
        productData
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to update product");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/admin/products/${id}`);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Category methods
  async getClassCategories(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>(
        "/classes/categories"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return ["Zumba", "HIIT", "Yoga", "Strength", "Cardio", "Senior Fitness"];
    } catch (error) {
      console.error("API Error:", error);
      return ["Zumba", "HIIT", "Yoga", "Strength", "Cardio", "Senior Fitness"];
    }
  },

  async getProductCategories(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>(
        "/products/categories"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return ["Supplements", "Equipment", "Apparel", "Tech", "Accessories"];
    } catch (error) {
      console.error("API Error:", error);
      return ["Supplements", "Equipment", "Apparel", "Tech", "Accessories"];
    }
  },

  // Admin stats
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await api.get<ApiResponse<AdminStats>>("/admin/stats");
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to get admin stats");
    } catch (error) {
      console.error("API Error:", error);
      return {
        totalRevenue: 0,
        totalUsers: 0,
        totalClasses: 0,
        totalProducts: 0,
        activeSubscriptions: 0,
        pendingOrders: 0,
      };
    }
  },

  // User management
  async getUsers(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
        `/admin/users?page=${page}&per_page=${perPage}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error("Failed to get users");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          from: 0,
          to: 0,
        },
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      };
    }
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    try {
      const response = await api.patch<ApiResponse<User>>(
        `/admin/users/${id}/role`,
        { role }
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to update user role");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Newsletter subscription
  async subscribeToNewsletter(
    email: string,
    name?: string
  ): Promise<NewsletterSubscription> {
    try {
      const response = await api.post<ApiResponse<NewsletterResponseData>>(
        "/newsletter/subscribe",
        { email, name }
      );
      if (response.data.success) {
        return response.data.data.subscription;
      }
      throw new Error("Failed to subscribe");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Blog posts
  async getPosts(): Promise<Post[]> {
    try {
      const response = await api.get<ApiResponse<Post[]>>("/posts");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const response = await api.get<ApiResponse<Post>>(`/posts/${slug}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },

  // Payment methods
  async initializePaystackPayment(data: {
    email: string;
    amount: number;
    currency: string;
    reference: string;
    callback_url: string;
    metadata?: Record<string, unknown>;
  }): Promise<PaymentInitResponse> {
    try {
      const response = await api.post<ApiResponse<PaymentInitResponse>>(
        "/payments/paystack/initialize",
        data
      );
      if (response.data.success) {
        return response.data.data;
      }
      return { success: false, message: "Failed to initialize payment" };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Payment initialization failed" };
    }
  },

  async verifyPaystackPayment(reference: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await api.get<ApiResponse<PaymentVerifyResponse>>(
        `/payments/paystack/verify/${reference}`
      );
      if (response.data.success) {
        return response.data.data;
      }
      return { success: false, status: "failed", message: "Verification failed" };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, status: "failed", message: "Verification failed" };
    }
  },

  async initializePayPalPayment(data: {
    amount: number;
    currency: string;
    return_url: string;
    cancel_url: string;
    metadata?: Record<string, unknown>;
  }): Promise<PaymentInitResponse> {
    try {
      const response = await api.post<ApiResponse<PaymentInitResponse>>(
        "/payments/paypal/create",
        data
      );
      if (response.data.success) {
        return response.data.data;
      }
      return { success: false, message: "Failed to create PayPal order" };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "PayPal initialization failed" };
    }
  },

  async capturePayPalPayment(orderId: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await api.post<ApiResponse<PaymentVerifyResponse>>(
        `/payments/paypal/capture/${orderId}`
      );
      if (response.data.success) {
        return response.data.data;
      }
      return { success: false, status: "failed", message: "Capture failed" };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, status: "failed", message: "Capture failed" };
    }
  },

  // Upload to Cloudinary
  async uploadToCloudinary(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<ApiResponse<{ url: string }>>(
        "/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && response.data.data.url) {
        return response.data.data.url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
