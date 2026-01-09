import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Lock,
  Gift,
  Sparkles,
  CheckCircle,
  Package,
  Calendar,
  Users,
  Clock,
  Video,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrency } from "@/hooks/useCurrency";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

// Types for class checkout
interface ClassCheckoutItem {
  id: string;
  name: string;
  description: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  spotsAvailable: number;
  price: number;
  category: string;
  instructor: string;
  location?: string;
  image?: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { formatPrice, currency } = useCurrency();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // State for class checkout
  const [classCheckoutItems, setClassCheckoutItems] = useState<
    ClassCheckoutItem[]
  >([]);
  const [isClassCheckout, setIsClassCheckout] = useState(false);
  const [bulkDiscount, setBulkDiscount] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "Nigeria",
    postalCode: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  // Parse URL parameters for class checkout
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const classIds = params.get("classIds");
    const classId = params.get("classId");
    const total = params.get("total");
    const discount = params.get("discount");

    if (classIds || classId) {
      setIsClassCheckout(true);

      // If we have class IDs from bulk purchase
      if (classIds) {
        const ids = classIds.split(",");
        // In a real app, you would fetch these classes from your API
        // For now, we'll use mock data
        const mockClasses: ClassCheckoutItem[] = ids.map((id, index) => ({
          id,
          name: `Fitness Class ${id}`,
          description: "Join this amazing fitness class",
          type: index % 2 === 0 ? "in-person" : "virtual",
          date: new Date(Date.now() + index * 86400000)
            .toISOString()
            .split("T")[0],
          time: index % 2 === 0 ? "18:00" : "10:00",
          duration: "60 minutes",
          spotsAvailable: 15,
          price: 15,
          category: "Zumba",
          instructor: "Dr. Blossom",
          location: "Lagos Main Studio",
        }));

        setClassCheckoutItems(mockClasses);
        if (discount) setBulkDiscount(parseFloat(discount));
      }
      // Single class checkout
      else if (classId) {
        const mockClass: ClassCheckoutItem = {
          id: classId,
          name: "Zumba Fiesta",
          description: "High-energy dance fitness party with Latin rhythms",
          type: "in-person",
          date: new Date().toISOString().split("T")[0],
          time: "18:00",
          duration: "60 minutes",
          spotsAvailable: 15,
          price: 15,
          category: "Zumba",
          instructor: "Dr. Blossom",
          location: "Lagos Main Studio",
        };

        setClassCheckoutItems([mockClass]);
      }
    }
  }, [location]);

  // Calculate totals
  const getSubtotal = () => {
    if (isClassCheckout) {
      return classCheckoutItems.reduce((sum, item) => sum + item.price, 0);
    }
    return getTotalPrice();
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    return subtotal * discount + (isClassCheckout ? bulkDiscount : 0);
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    return (subtotal - discountAmount) * 0.1;
  };

  const getShipping = () => {
    // Only charge shipping for physical products, not classes
    return isClassCheckout ? 0 : 0; // You can adjust shipping logic here
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const tax = getTax();
    const shipping = getShipping();
    return subtotal - discountAmount + tax + shipping;
  };

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const symbols = { usd: "$", naira: "₦", gbp: "£" };

  const handleApplyPromo = () => {
    const promos: Record<string, number> = {
      BLOSSOM10: 0.1,
      FITNESS20: 0.2,
      WELCOME15: 0.15,
    };

    const code = promoCode.toUpperCase();
    if (promos[code]) {
      setDiscount(promos[code]);
      toast({
        title: "Promo Code Applied!",
        description: `${
          promos[code] * 100
        }% discount has been applied to your order.`,
      });
    } else {
      setDiscount(0);
      toast({
        title: "Invalid Code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Get recommended payment gateway based on currency
  const getRecommendedGateway = () => {
    if (currency === "₦") return "paystack";
    return "paypal"; // USD and GBP use PayPal
  };

  // Helper to get currency code
  const getCurrencyCode = () => {
    if (currency === "₦") return "NGN";
    if (currency === "$") return "USD";
    return "GBP";
  };

  const isNaira = currency === "₦";
      toast({
        title: "Login Required",
        description: "Please login to complete your purchase",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const orderReference = `ORDER-${Date.now()}`;
      const amountInSmallestUnit = currency === "naira" ? total * 100 : total * 100; // Convert to kobo/cents
      
      if (paymentMethod === "paystack" || (paymentMethod === "card" && currency === "naira")) {
        // Use Paystack for Naira payments
        const paymentData = {
          email: formData.email || user?.email || "",
          amount: amountInSmallestUnit,
          currency: currency === "naira" ? "NGN" : "USD",
          reference: orderReference,
          callback_url: `${window.location.origin}/payment/callback?gateway=paystack`,
          metadata: {
            cart_items: isClassCheckout ? classCheckoutItems : cartState.items,
            user_id: user?.id,
            is_class_checkout: isClassCheckout,
          },
        };

        const response = await apiService.initializePaystackPayment(paymentData);
        
        if (response.success && response.authorization_url) {
          // Redirect to Paystack payment page
          window.location.href = response.authorization_url;
          return;
        } else {
          throw new Error(response.message || "Failed to initialize Paystack payment");
        }
      } else if (paymentMethod === "paypal" || (paymentMethod === "card" && currency !== "naira")) {
        // Use PayPal for USD/GBP payments
        const paymentData = {
          amount: total,
          currency: currency === "usd" ? "USD" : "GBP",
          description: isClassCheckout ? "Class Subscription" : "Product Purchase",
          return_url: `${window.location.origin}/payment/callback?gateway=paypal`,
          cancel_url: `${window.location.origin}/checkout`,
          metadata: {
            cart_items: isClassCheckout ? classCheckoutItems : cartState.items,
            user_id: user?.id,
            is_class_checkout: isClassCheckout,
          },
        };

        const response = await apiService.initializePayPalPayment(paymentData);
        
        if (response.success && response.authorization_url) {
          // Redirect to PayPal payment page
          window.location.href = response.authorization_url;
          return;
        } else {
          throw new Error(response.message || "Failed to initialize PayPal payment");
        }
      } else if (paymentMethod === "bank") {
        // Bank transfer - show bank details
        toast({
          title: "Bank Transfer Details",
          description: "Please transfer to: Bank Name, Account: XXXXXXXXXX, Reference: " + orderReference,
        });
        
        // Create pending order
        if (isClassCheckout) {
          const classIds = classCheckoutItems.map((item) => item.id);
          for (const classId of classIds) {
            await apiService.subscribeToClass(classId, user?.id);
          }
          navigate(`/dashboard?pending=true&ref=${orderReference}`);
        } else {
          navigate(`/order-confirmation/${orderReference}?pending=true`);
        }
        return;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if checkout is empty
  const isEmpty = () => {
    if (isClassCheckout) {
      return classCheckoutItems.length === 0;
    }
    return cartState.items.length === 0;
  };

  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className={`w-24 h-24 bg-gradient-to-r from-[#9902f7] to-[#667eea] rounded-3xl mx-auto mb-8 flex items-center justify-center`}
            >
              {isClassCheckout ? (
                <Calendar className="h-12 w-12 text-white" />
              ) : (
                <Package className="h-12 w-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {isClassCheckout ? "No Classes Selected" : "Your Cart is Empty"}
            </h1>
            <p className="text-gray-600 mb-8">
              {isClassCheckout
                ? "You need to select classes to proceed to checkout."
                : "You need items in your cart to proceed to checkout."}
            </p>
            <Link to={isClassCheckout ? "/classes" : "/shop"}>
              <Button className="btn-primary bg-gradient-to-r from-[#9902f7] to-[#667eea]">
                {isClassCheckout ? "Browse Classes" : "Start Shopping"}
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/15 via-[#667eea]/15 to-[#00d4ff]/15">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4ff]/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-[#9902f7]/20 via-[#667eea]/20 to-[#00d4ff]/20 mb-6">
              <Lock className="h-4 w-4 text-[#9902f7] mr-2" />
              <span className="text-sm font-semibold text-[#9902f7]">
                SECURE CHECKOUT
              </span>
              <Lock className="h-4 w-4 text-[#00d4ff] ml-2" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent">
                {isClassCheckout ? "Class Subscription" : "Checkout"}
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {isClassCheckout
                ? "Complete your class subscription with confidence"
                : "Complete your purchase with confidence"}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center mb-8">
            <Link to={isClassCheckout ? "/classes" : "/cart"}>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-[#9902f7] hover:bg-[#9902f7]/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {isClassCheckout ? "Classes" : "Cart"}
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card className="relative overflow-hidden border border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff]" />
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                      <Sparkles className="mr-3 h-5 w-5 text-[#9902f7]" />
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {!isClassCheckout && (
                  <Card className="relative overflow-hidden border border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff]" />
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-6 flex items-center">
                        <Truck className="mr-3 h-5 w-5 text-[#9902f7]" />
                        Shipping Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-700">
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-700">
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address" className="text-gray-700">
                            Address *
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street address"
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city" className="text-gray-700">
                            City *
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country" className="text-gray-700">
                            Country *
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            required
                            value={formData.country}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode" className="text-gray700">
                            Postal Code *
                          </Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            required
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-700">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Payment Method */}
                <Card className="relative overflow-hidden border border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8026d9] to-[#a855f7]" />
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center text-[#8026d9]">
                      <CreditCard className="mr-3 h-5 w-5" />
                      Payment Method
                    </h2>
                    
                    {/* Currency-based recommendation */}
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Recommended:</strong> Based on your currency ({getCurrencyCode()}), 
                        we recommend {isNaira ? "Paystack" : "PayPal"} for the best experience.
                      </p>
                    </div>

                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {/* Paystack - Recommended for Naira */}
                      <div className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                        isNaira ? "border-[#8026d9] bg-purple-50" : "border-gray-200 hover:border-[#8026d9]"
                      }`}>
                        <RadioGroupItem
                          value="paystack"
                          id="paystack"
                          className="text-[#8026d9]"
                        />
                        <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>Paystack</span>
                            {isNaira && (
                              <span className="text-xs bg-[#8026d9] text-white px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">Card, Bank Transfer, USSD</span>
                        </Label>
                      </div>

                      {/* PayPal - Recommended for USD/GBP */}
                      <div className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                        !isNaira ? "border-[#8026d9] bg-purple-50" : "border-gray-200 hover:border-[#8026d9]"
                      }`}>
                        <RadioGroupItem
                          value="paypal"
                          id="paypal"
                          className="text-[#8026d9]"
                        />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>PayPal</span>
                            {!isNaira && (
                              <span className="text-xs bg-[#8026d9] text-white px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">PayPal, Credit/Debit Card</span>
                        </Label>
                      </div>

                      {/* Bank Transfer */}
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#8026d9] transition-colors">
                        <RadioGroupItem
                          value="bank"
                          id="bank"
                          className="text-[#8026d9]"
                        />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                          <span>Direct Bank Transfer</span>
                          <span className="block text-xs text-gray-500">Manual transfer (may take 24-48hrs to confirm)</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <div>
                          <Label htmlFor="cardNumber" className="text-gray-700">
                            Card Number *
                          </Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            required
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="expiryDate"
                              className="text-gray-700"
                            >
                              Expiry Date *
                            </Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              required
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-gray-700">
                              CVV *
                            </Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              required
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="nameOnCard" className="text-gray-700">
                            Name on Card *
                          </Label>
                          <Input
                            id="nameOnCard"
                            name="nameOnCard"
                            required
                            value={formData.nameOnCard}
                            onChange={handleInputChange}
                            className="mt-2 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="sticky top-6 border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff]" />
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        {isClassCheckout ? (
                          <Calendar className="mr-3 h-6 w-6 text-[#9902f7]" />
                        ) : (
                          <Package className="mr-3 h-6 w-6 text-[#9902f7]" />
                        )}
                        {isClassCheckout ? "Class Summary" : "Order Summary"}
                      </h2>

                      <div className="space-y-4 mb-6">
                        {isClassCheckout ? (
                          // Class items display
                          <div className="space-y-4">
                            {classCheckoutItems.map((classItem) => (
                              <div
                                key={classItem.id}
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-bold text-gray-900">
                                      {classItem.name}
                                    </h4>
                                    <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                      {classItem.category}
                                    </Badge>
                                  </div>
                                  <span className="font-bold text-[#9902f7]">
                                    ${classItem.price}
                                  </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-2" />
                                    {classItem.duration}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-2" />
                                    {new Date(
                                      classItem.date
                                    ).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}{" "}
                                    at {classItem.time}
                                  </div>
                                  <div className="flex items-center">
                                    {classItem.type === "virtual" ? (
                                      <Video className="w-3 h-3 mr-2" />
                                    ) : (
                                      <MapPin className="w-3 h-3 mr-2" />
                                    )}
                                    {classItem.type === "virtual"
                                      ? "Virtual"
                                      : classItem.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-3 h-3 mr-2" />
                                    {classItem.spotsAvailable} spots left
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Product items display
                          cartState.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-bold text-[#9902f7]">
                                {symbols[cartState.currency]}
                                {(
                                  item.price[cartState.currency] * item.quantity
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <Separator className="my-6" />

                      {/* Promo Code */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-medium text-gray-700">
                            Promo Code
                          </Label>
                          <Gift className="h-4 w-4 text-[#9902f7]" />
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={promoCode}
                            onChange={(e) =>
                              setPromoCode(e.target.value.toUpperCase())
                            }
                            placeholder="Enter code"
                            className="flex-1 border-gray-300 focus:border-[#9902f7] focus:ring-[#9902f7]"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleApplyPromo}
                            className="border-[#9902f7] text-[#9902f7] hover:bg-[#9902f7] hover:text-white"
                          >
                            <Tag className="w-4 h-4 mr-2" />
                            Apply
                          </Button>
                        </div>
                        {discount > 0 && (
                          <p className="text-sm text-green-600 mt-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {discount * 100}% discount applied!
                          </p>
                        )}
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            {symbols[cartState.currency]}
                            {subtotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        {/* Bulk discount for classes */}
                        {isClassCheckout && bulkDiscount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Bulk Discount</span>
                            <span className="font-medium">
                              -$
                              {bulkDiscount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}

                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Promo Discount</span>
                            <span className="font-medium">
                              -{symbols[cartState.currency]}
                              {(subtotal * discount).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}

                        {!isClassCheckout && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-green-600">
                              FREE
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">
                            {symbols[cartState.currency]}
                            {tax.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            Total Amount
                          </div>
                          <div className="text-sm text-gray-600">
                            {isClassCheckout
                              ? "Including all taxes"
                              : "Including all taxes and shipping"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                            {symbols[cartState.currency]}
                            {total.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {cartState.currency.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-6">
                        <Checkbox
                          id="terms"
                          required
                          className="text-[#9902f7] border-gray-300"
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          I agree to the Terms of Service and Privacy Policy
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9902f7] to-[#667eea] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-white py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing{" "}
                            {isClassCheckout ? "Subscription" : "Order"}...
                          </span>
                        ) : (
                          `${
                            isClassCheckout
                              ? "Subscribe to Classes"
                              : "Place Order"
                          } - ${
                            symbols[cartState.currency]
                          }${total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        )}
                      </Button>

                      <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <Shield className="mr-2 h-4 w-4 text-green-500" />
                          <span>
                            256-bit SSL Secured • Your data is protected
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500 mb-2">
                          Accepted Payment Methods
                        </p>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {[
                            "Visa",
                            "Mastercard",
                            "PayPal",
                            "Apple Pay",
                            "Google Pay",
                          ].map((method) => (
                            <div
                              key={method}
                              className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700"
                            >
                              {method}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
