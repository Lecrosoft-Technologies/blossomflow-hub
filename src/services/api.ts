// API service layer - ready to connect to backend endpoints

// TODO: Replace with your Laravel backend URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  type: 'virtual' | 'in-person';
  date: string;
  time: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  capacity: number;
  spotsAvailable: number;
  image?: string;
  zoomLink?: string; // Only available after purchase
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  stock: number;
  requiresShipping: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentMethod?: string;
}

export interface OrderItem {
  id: string;
  type: 'class' | 'product';
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discount: number; // percentage or fixed amount
  type: 'percentage' | 'fixed';
  applicableTo: 'all' | 'class' | 'product';
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
}

export interface PurchasedClass {
  id: string;
  userId: string;
  classId: string;
  orderId: string;
  zoomLink: string;
  purchasedAt: string;
  attended: boolean;
}

// Mock data - will be replaced with API calls
export const mockClasses: Class[] = [
  {
    id: 'c1',
    name: 'High-Energy Zumba',
    description: 'Dance your way to fitness with Dr. Blossom',
    instructor: 'Dr. Blossom Maduafokwa',
    type: 'virtual',
    date: '2025-01-15',
    time: '18:00',
    duration: 60,
    price: 3000,
    currency: '₦',
    capacity: 50,
    spotsAvailable: 12,
  },
  {
    id: 'c2',
    name: 'Zumba Gold (Seniors)',
    description: 'Low-impact Zumba for mature participants',
    instructor: 'Dr. Blossom Maduafokwa',
    type: 'in-person',
    date: '2025-01-16',
    time: '10:00',
    duration: 45,
    price: 2500,
    currency: '₦',
    capacity: 30,
    spotsAvailable: 8,
  },
];

// API-ready functions
export const apiService = {
  // Classes
  async getClasses(): Promise<Class[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data
      return mockClasses;
    }
  },

  async getClassById(id: string): Promise<Class | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch class');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return mockClasses.find(c => c.id === id) || null;
    }
  },

  // Orders
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to local creation
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        userId: orderData.userId || 'guest',
        items: orderData.items || [],
        total: orderData.total || 0,
        currency: orderData.currency || '₦',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return newOrder;
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      const orders = localStorage.getItem(`orders_${userId}`);
      return orders ? JSON.parse(orders) : [];
    }
  },

  // Promo Codes
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/promo-codes/validate/${code}`);
      if (!response.ok) throw new Error('Failed to validate promo code');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      const promoCodes = localStorage.getItem('promoCodes');
      const codes: PromoCode[] = promoCodes ? JSON.parse(promoCodes) : [];
      return codes.find(p => p.code === code) || null;
    }
  },

  // Purchased Classes
  async getPurchasedClasses(userId: string): Promise<PurchasedClass[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/purchased-classes`);
      if (!response.ok) throw new Error('Failed to fetch purchased classes');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      const purchased = localStorage.getItem(`purchased_classes_${userId}`);
      return purchased ? JSON.parse(purchased) : [];
    }
  },

  async purchaseClass(userId: string, classId: string, orderId: string): Promise<PurchasedClass> {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, classId, orderId }),
      });
      if (!response.ok) throw new Error('Failed to purchase class');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to local creation
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
      localStorage.setItem(`purchased_classes_${userId}`, JSON.stringify([...existing, purchased]));
      
      return purchased;
    }
  },
  
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
