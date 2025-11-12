// Payment service for Paystack and PayPal integration

// TODO: Add your Paystack Public Key
const PAYSTACK_PUBLIC_KEY = process.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxx';

// TODO: Add your PayPal Client ID
const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID || 'xxxxxxxxxxxxx';

// Laravel API base URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export interface PaymentData {
  email: string;
  amount: number;
  currency: 'NGN' | 'USD';
  reference: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  message?: string;
  authorization_url?: string;
}

// Paystack Integration
export const paystackService = {
  // Initialize payment
  async initializePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paystack/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount * 100, // Convert to kobo
          currency: data.currency,
          reference: data.reference,
          metadata: data.metadata,
          callback_url: `${window.location.origin}/payment/callback`,
        }),
      });

      if (!response.ok) throw new Error('Payment initialization failed');
      const result = await response.json();
      
      // Redirect to Paystack payment page
      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      }
      
      return result;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return {
        success: false,
        reference: data.reference,
        message: 'Payment initialization failed',
      };
    }
  },

  // Verify payment
  async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paystack/verify/${reference}`);
      if (!response.ok) throw new Error('Payment verification failed');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Paystack verification error:', error);
      return {
        success: false,
        reference,
        message: 'Payment verification failed',
      };
    }
  },

  // Handle webhook (for backend use)
  async handleWebhook(payload: any, signature: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/paystack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Paystack-Signature': signature,
        },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch (error) {
      console.error('Paystack webhook error:', error);
      return false;
    }
  },
};

// PayPal Integration
export const paypalService = {
  async createOrder(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paypal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          reference: data.reference,
          metadata: data.metadata,
          return_url: `${window.location.origin}/payment/callback`,
          cancel_url: `${window.location.origin}/cart`,
        }),
      });

      if (!response.ok) throw new Error('PayPal order creation failed');
      const result = await response.json();
      
      // Redirect to PayPal approval URL
      if (result.approval_url) {
        window.location.href = result.approval_url;
      }
      
      return result;
    } catch (error) {
      console.error('PayPal order creation error:', error);
      return {
        success: false,
        reference: data.reference,
        message: 'PayPal order creation failed',
      };
    }
  },

  async captureOrder(orderId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paypal/capture/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('PayPal capture failed');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('PayPal capture error:', error);
      return {
        success: false,
        reference: orderId,
        message: 'PayPal capture failed',
      };
    }
  },

  // Handle webhook (for backend use)
  async handleWebhook(payload: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/paypal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch (error) {
      console.error('PayPal webhook error:', error);
      return false;
    }
  },
};

// Generate unique payment reference
export const generatePaymentReference = () => {
  return `BF_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`.toUpperCase();
};
