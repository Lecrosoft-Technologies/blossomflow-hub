// Payment service for Paystack and PayPal integration
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
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/payments/paystack/initialize', {
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
        }),
      });

      const result = await response.json();
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
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/payments/paystack/verify/${reference}`);
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
};

// PayPal Integration
export const paypalService = {
  async createOrder(data: PaymentData): Promise<PaymentResponse> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/payments/paypal/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
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
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/payments/paypal/capture/${orderId}`, {
        method: 'POST',
      });

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
};

// Generate unique payment reference
export const generatePaymentReference = () => {
  return `BF_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`.toUpperCase();
};
