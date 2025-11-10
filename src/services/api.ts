// API service layer - ready to connect to backend endpoints

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
    // TODO: Replace with actual API call
    // const response = await fetch('/api/classes');
    // return response.json();
    return mockClasses;
  },

  async getClassById(id: string): Promise<Class | null> {
    // TODO: Replace with actual API call
    return mockClasses.find(c => c.id === id) || null;
  },

  // Orders
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   body: JSON.stringify(orderData),
    // });
    // return response.json();
    
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
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    // TODO: Replace with actual API call
    const orders = localStorage.getItem(`orders_${userId}`);
    return orders ? JSON.parse(orders) : [];
  },

  // Promo Codes
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    // TODO: Replace with actual API call
    const promoCodes = localStorage.getItem('promoCodes');
    const codes: PromoCode[] = promoCodes ? JSON.parse(promoCodes) : [];
    return codes.find(p => p.code === code) || null;
  },

  // Purchased Classes
  async getPurchasedClasses(userId: string): Promise<PurchasedClass[]> {
    // TODO: Replace with actual API call
    const purchased = localStorage.getItem(`purchased_classes_${userId}`);
    return purchased ? JSON.parse(purchased) : [];
  },

  async purchaseClass(userId: string, classId: string, orderId: string): Promise<PurchasedClass> {
    // TODO: Replace with actual API call
    const purchased: PurchasedClass = {
      id: `pc-${Date.now()}`,
      userId,
      classId,
      orderId,
      zoomLink: `https://zoom.us/j/mock-${classId}-${Date.now()}`,
      purchasedAt: new Date().toISOString(),
      attended: false,
    };

    // Store in localStorage temporarily
    const existing = await this.getPurchasedClasses(userId);
    localStorage.setItem(`purchased_classes_${userId}`, JSON.stringify([...existing, purchased]));
    
    return purchased;
  },
};
