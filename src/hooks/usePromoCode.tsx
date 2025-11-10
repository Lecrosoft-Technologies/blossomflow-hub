import { useState } from 'react';
import { apiService, PromoCode } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const usePromoCode = () => {
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setPromoCode(null);
      return;
    }

    setIsValidating(true);
    try {
      const validCode = await apiService.validatePromoCode(code.toUpperCase());
      
      if (validCode) {
        setPromoCode(validCode);
        toast({
          title: 'Promo Code Applied!',
          description: `You got ${validCode.type === 'percentage' ? validCode.discount + '%' : '₦' + validCode.discount} off`,
        });
      } else {
        setPromoCode(null);
        toast({
          title: 'Invalid Promo Code',
          description: 'The code you entered is not valid or has expired.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate promo code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const calculateDiscount = (total: number): number => {
    if (!promoCode) return 0;
    
    if (promoCode.type === 'percentage') {
      return (total * promoCode.discount) / 100;
    }
    return promoCode.discount;
  };

  const clearPromoCode = () => setPromoCode(null);

  return {
    promoCode,
    isValidating,
    validateCode,
    calculateDiscount,
    clearPromoCode,
  };
};
