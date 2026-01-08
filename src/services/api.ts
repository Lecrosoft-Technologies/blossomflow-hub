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
      const purchased = localStorage.getItem(`purchased_classes_${userId}`);
      return purchased ? JSON.parse(purchased) : [];
    }
  },

  async purchaseClass(
    userId: string,
    classId: string,
    orderId: string
  ): Promise<PurchasedClass> {
    try {
      const response = await api.post<ApiResponse<LaravelPurchasedClass>>(
        "/classes/purchase",
        {
          user_id: parseInt(userId.replace("user-", "")),
          class_id: parseInt(classId.replace("c", "")),
          order_id: parseInt(orderId.replace("ord-", "")),
        }
      );

      if (
        response.data.success &&
        isLaravelPurchasedClass(response.data.data)
      ) {
        return convertLaravelPurchasedClass(response.data.data);
      }

      throw new Error("Failed to purchase class");
    } catch (error) {
      console.error("API Error:", error);
      const purchased: PurchasedClass = {
        id: `pc-${Date.now()}`,
        userId,
        classId,
        orderId,
        zoomLink: `https://zoom.us/j/mock-${classId}-${Date.now()}`,
        purchasedAt: new Date().toISOString(),
        attended: false,
      };

      const existing = await this.getPurchasedClasses(userId);
      localStorage.setItem(
        `purchased_classes_${userId}`,
        JSON.stringify([...existing, purchased])
      );

      return purchased;
    }
  },

  // Subscription method
  async subscribeToClass(
    classId: string,
    userId?: string
  ): Promise<PurchasedClass> {
    try {
      const response = await api.post<ApiResponse<LaravelPurchasedClass>>(
        "/classes/subscribe",
        {
          class_id: parseInt(classId.replace(/\D/g, "")),
          user_id: userId ? parseInt(userId.replace(/\D/g, "")) : null,
        }
      );

      if (
        response.data.success &&
        isLaravelPurchasedClass(response.data.data)
      ) {
        return convertLaravelPurchasedClass(response.data.data);
      }

      throw new Error("Failed to subscribe to class");
    } catch (error) {
      console.error("API Error:", error);
      const purchased: PurchasedClass = {
        id: `pc-${Date.now()}`,
        userId: userId || "user-1",
        classId,
        orderId: `ord-${Date.now()}`,
        zoomLink: `https://zoom.us/j/class-${classId}`,
        purchasedAt: new Date().toISOString(),
        attended: false,
        status: "upcoming",
      };

      return purchased;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>("/products");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("API Error:", error);
      return null;
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

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post<ApiResponse<Product>>("/admin/products", {
        name: product.name,
        description: product.description,
        price: product.price?.naira || product.price?.usd || 0,
        price_naira: product.price?.naira,
        price_usd: product.price?.usd,
        price_gbp: product.price?.gbp,
        image: product.image,
        category: product.category,
        in_stock: product.inStock,
      });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to create product");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const response = await api.put<ApiResponse<Product>>(
        `/admin/products/${id}`,
        {
          name: product.name,
          description: product.description,
          price: product.price?.naira || product.price?.usd || 0,
          price_naira: product.price?.naira,
          price_usd: product.price?.usd,
          price_gbp: product.price?.gbp,
          image: product.image,
          category: product.category,
          in_stock: product.inStock,
        }
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

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        "/products/search",
        {
          params: { query, category },
        }
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      const products = await this.getProducts();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (category && p.category.toLowerCase() === category.toLowerCase())
      );
    } catch (error) {
      console.error("API Error:", error);
      return mockProducts;
    }
  },

  async getPostCategories(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<unknown[]>>(
        "/posts/categories"
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        const categories: string[] = response.data.data
          .map((item): string => safeToString(item))
          .filter((category): category is string => category.trim() !== "");

        return categories;
      }

      return [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
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
      return Array.from(new Set(mockProducts.map((p) => p.category)));
    } catch (error) {
      console.error("API Error:", error);
      return Array.from(new Set(mockProducts.map((p) => p.category)));
    }
  },

  async getClassCategories(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>(
        "/classes/categories"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return ["Fitness", "Seniors", "Kids", "Advanced", "Zumba", "Cardio"];
    } catch (error) {
      console.error("API Error:", error);
      return ["Fitness", "Seniors", "Kids", "Advanced", "Zumba", "Cardio"];
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        "/products/featured"
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return mockProducts.slice(0, 4);
    } catch (error) {
      console.error("API Error:", error);
      return mockProducts.slice(0, 4);
    }
  },

  async updateProductStock(id: string, inStock: boolean): Promise<Product> {
    try {
      const response = await api.patch<ApiResponse<Product>>(
        `/admin/products/${id}/stock`,
        { in_stock: inStock }
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to update product stock");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Blog methods
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

  // Newsletter methods
  async subscribeToNewsletter(
    email: string,
    name?: string
  ): Promise<NewsletterSubscription | null> {
    try {
      const response = await api.post<
        ApiResponse<NewsletterResponseData> & { message: string }
      >("/newsletter/subscribe", {
        email,
        name,
        subscription_type: "weekly",
      });

      if (response.data.success) {
        return response.data.data.subscription;
      }
      return null;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    try {
      const response = await api.post<ApiResponse<null>>(
        "/newsletter/unsubscribe",
        { email }
      );

      return response.data.success;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  },

  async getSubscriberCount(): Promise<number> {
    try {
      const response = await api.get<ApiResponse<{ subscriber_count: number }>>(
        "/newsletter/subscriber-count"
      );

      if (response.data.success) {
        return response.data.data.subscriber_count;
      }
      return 0;
    } catch (error) {
      console.error("API Error:", error);
      return 0;
    }
  },

  // Admin methods
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
};
