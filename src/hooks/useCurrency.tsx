import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  currency: '₦' | '$' | '£';
  setCurrency: (currency: '₦' | '$' | '£') => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

// Exchange rates (hardcoded for now, should come from API)
const EXCHANGE_RATE_NGN_TO_USD = 0.0012; // 1 NGN = 0.0012 USD
const EXCHANGE_RATE_NGN_TO_GBP = 0.00095; // 1 NGN = 0.00095 GBP

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: '₦',
      setCurrency: (currency) => set({ currency }),
      formatPrice: (price: number) => {
        const { currency } = get();
        const convertedPrice = get().convertPrice(price);
        switch (currency) {
          case '₦':
            return `₦${convertedPrice.toLocaleString()}`;
          case '$':
            return `$${convertedPrice.toFixed(2)}`;
          case '£':
            return `£${convertedPrice.toFixed(2)}`;
          default:
            return `₦${convertedPrice.toLocaleString()}`;
        }
      },
      convertPrice: (price: number) => {
        const { currency } = get();
        switch (currency) {
          case '$':
            return price * EXCHANGE_RATE_NGN_TO_USD;
          case '£':
            return price * EXCHANGE_RATE_NGN_TO_GBP;
          default:
            return price;
        }
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
