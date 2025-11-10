import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  currency: '₦' | '$';
  setCurrency: (currency: '₦' | '$') => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

// Exchange rate (hardcoded for now, should come from API)
const EXCHANGE_RATE = 0.0012; // 1 NGN = 0.0012 USD

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: '₦',
      setCurrency: (currency) => set({ currency }),
      formatPrice: (price: number) => {
        const { currency } = get();
        const convertedPrice = get().convertPrice(price);
        return currency === '₦' 
          ? `₦${convertedPrice.toLocaleString()}`
          : `$${convertedPrice.toFixed(2)}`;
      },
      convertPrice: (price: number) => {
        const { currency } = get();
        return currency === '$' ? price * EXCHANGE_RATE : price;
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
