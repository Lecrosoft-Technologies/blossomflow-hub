import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Truck,
  Shield,
  Gift,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "recharts";

const Cart = () => {
  const { state, updateQuantity, removeItem, getTotalPrice, formatPrice } =
    useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleCheckout = () => {
    // Check if user is logged in - replace with actual auth check
    const isLoggedIn = true; // TODO: Replace with actual auth state from context

    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
      return;
    }

    navigate("/checkout");
  };

  const handleApplyPromo = () => {
    // Demo promo codes
    const promos: Record<string, number> = {
      BLOSSOM10: 0.1, // 10% off
      FITNESS20: 0.2, // 20% off
      WELCOME15: 0.15, // 15% off
    };

    const code = promoCode.toUpperCase();
    if (promos[code]) {
      setDiscount(promos[code]);
    } else {
      setDiscount(0);
    }
  };

  const symbols = { usd: "$", naira: "₦", gbp: "£" };
  const subtotal = getTotalPrice();
  const discountAmount = subtotal * discount;
  const tax = (subtotal - discountAmount) * 0.1;
  const shipping = 0; // Free shipping
  const total = subtotal - discountAmount + tax + shipping;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/15 via-[#667eea]/15 to-[#00d4ff]/15">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4ff]/20 via-transparent to-transparent" />
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#9902f7]/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-[#9902f7]/20 via-[#667eea]/20 to-[#00d4ff]/20 mb-6">
                <Sparkles className="h-4 w-4 text-[#9902f7] mr-2" />
                <span className="text-sm font-semibold text-[#9902f7]">
                  YOUR SHOPPING CART
                </span>
                <Sparkles className="h-4 w-4 text-[#00d4ff] ml-2" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent">
                  Shopping Cart
                </span>
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                Your fitness journey awaits. Fill your cart with premium gear
                and supplements.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] rounded-3xl animate-pulse" />
              <div className="absolute inset-4 bg-white rounded-2xl flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gradient-to-r from-[#9902f7] to-[#667eea]" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any fitness gear to your cart yet.
              Start building your dream collection!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="btn-primary bg-gradient-to-r from-[#9902f7] to-[#667eea] hover:shadow-xl hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/shop")}
                size="lg"
              >
                Explore Shop
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 hover:border-[#9902f7] hover:text-[#9902f7]"
                onClick={() => navigate("/classes")}
                size="lg"
              >
                Browse Classes
              </Button>
            </div>
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
              <Sparkles className="h-4 w-4 text-[#9902f7] mr-2" />
              <span className="text-sm font-semibold text-[#9902f7]">
                REVIEW YOUR ORDER
              </span>
              <Sparkles className="h-4 w-4 text-[#00d4ff] ml-2" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent">
                Shopping Cart
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Review your fitness essentials before checkout
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <Link to="/shop">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-[#9902f7] hover:bg-[#9902f7]/5"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <h2 className="text-2xl font-bold ml-4">
                {state.items.length}{" "}
                {state.items.length === 1 ? "Item" : "Items"}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-4 w-4 text-green-500" />
                <span>Free Shipping</span>
                <Shield className="h-4 w-4 text-blue-500 ml-2" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 group bg-white/90 backdrop-blur-sm">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-32 h-32 overflow-hidden rounded-2xl flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-gradient-to-r from-[#9902f7] to-[#667eea] text-white text-xs font-bold rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#9902f7] transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            Premium quality product for optimal performance
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="h-8 w-8 hover:bg-white hover:text-[#9902f7]"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>

                                <span className="w-8 text-center font-bold text-gray-900">
                                  {item.quantity}
                                </span>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="h-8 w-8 hover:bg-white hover:text-[#9902f7]"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-lg font-bold text-gradient-to-r from-[#9902f7] to-[#667eea]">
                                {formatPrice(item.price)}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-500 hover:text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9902f7]/0 via-[#667eea]/0 to-[#00d4ff]/0 group-hover:from-[#9902f7]/5 group-hover:via-[#667eea]/5 group-hover:to-[#00d4ff]/5 transition-all duration-500 pointer-events-none" />
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="sticky top-6 border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <ShoppingBag className="mr-3 h-6 w-6 text-[#9902f7]" />
                      Order Summary
                    </h2>

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
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
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
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {discount * 100}% discount applied!
                        </p>
                      )}
                    </div>

                    <Separator className="my-6" />

                    {/* Order Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          {symbols[state.currency]}
                          {subtotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({discount * 100}%)</span>
                          <span className="font-medium">
                            -{symbols[state.currency]}
                            {discountAmount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">
                          {symbols[state.currency]}
                          {tax.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Total */}
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <div className="text-lg font-bold">Total</div>
                        <div className="text-sm text-gray-600">
                          Including all taxes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                          {symbols[state.currency]}
                          {total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {state.currency.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-[#9902f7] to-[#667eea] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-white py-6 text-lg font-bold"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>

                    {/* Security Info */}
                    <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        <span>Secure SSL Encryption • 256-bit Security</span>
                      </div>
                    </div>

                    {/* Accepted Payments */}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500 mb-2">We Accept</p>
                      <div className="flex justify-center gap-2">
                        {["Visa", "Mastercard", "PayPal", "Apple Pay"].map(
                          (method) => (
                            <div
                              key={method}
                              className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700"
                            >
                              {method}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
