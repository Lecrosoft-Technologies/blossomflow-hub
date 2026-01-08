import {
  CheckCircle,
  Truck,
  Package,
  Shield,
  Home,
  ShoppingBag,
  Sparkles,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState({
    id: orderId || "ORD-1767777707232",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: [
      {
        id: 1,
        name: "Pro Performance Whey Protein",
        quantity: 1,
        price: 49.99,
        category: "Supplements",
      },
      {
        id: 2,
        name: "Smart Fitness Tracker",
        quantity: 1,
        price: 129.99,
        category: "Tech",
      },
    ],
    shipping: {
      name: "Alex Johnson",
      address: "123 Fitness Street",
      city: "Lagos",
      country: "Nigeria",
      postalCode: "100001",
      phone: "+234 801 234 5678",
      email: "alex@example.com",
    },
    payment: {
      method: "Visa •••• 4242",
      total: 197.98,
    },
  });

  const [countdown, setCountdown] = useState(10);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOrderTotal = () => {
    return orderDetails.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <Header />

      {/* Confetti Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${
                i % 3 === 0 ? "#9902f7" : i % 3 === 1 ? "#667eea" : "#00d4ff"
              }, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 180, 360],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/15 via-[#667eea]/15 to-[#00d4ff]/15">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9902f7]/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4ff]/20 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="relative w-32 h-32 mx-auto mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="h-20 w-20 text-gradient-to-r from-[#9902f7] to-[#667eea]" />
                </div>
              </motion.div>

              {/* Title */}
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-[#9902f7]/20 via-[#667eea]/20 to-[#00d4ff]/20 mb-6">
                <Sparkles className="h-4 w-4 text-[#9902f7] mr-2" />
                <span className="text-sm font-semibold text-[#9902f7]">
                  ORDER CONFIRMED
                </span>
                <Sparkles className="h-4 w-4 text-[#00d4ff] ml-2" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff] bg-clip-text text-transparent">
                  Thank You!
                </span>
              </h1>

              <p className="text-xl text-gray-700 mb-8">
                Your order has been successfully placed. We're preparing it with
                care.
              </p>

              {/* Order ID */}
              <div className="inline-flex items-center bg-white rounded-2xl px-6 py-4 shadow-lg mb-8">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Order Number</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {orderDetails.id}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyOrderId}
                      className="text-[#9902f7] hover:text-[#9902f7] hover:bg-[#9902f7]/5"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <Clock className="h-6 w-6 text-[#9902f7] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{orderDetails.date}</p>
                  <p className="text-sm text-gray-500">{orderDetails.time}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <Package className="h-6 w-6 text-[#667eea] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orderDetails.items.length}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <Truck className="h-6 w-6 text-[#00d4ff] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">3-5 Business Days</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Order Details */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff]" />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <ShoppingBag className="mr-3 h-6 w-6 text-[#9902f7]" />
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      {orderDetails.items.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#9902f7]/20 to-[#667eea]/20 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-[#9902f7]" />
                              </div>
                              <span className="absolute -top-2 -right-2 bg-[#9902f7] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#9902f7]">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="text-sm text-gray-600">each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    {/* Order Total */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(getOrderTotal())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">
                          {formatCurrency(getOrderTotal() * 0.1)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            Total
                          </p>
                          <p className="text-sm text-gray-600">
                            Paid with {orderDetails.payment.method}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold bg-gradient-to-r from-[#9902f7] to-[#667eea] bg-clip-text text-transparent">
                            {formatCurrency(orderDetails.payment.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Right Column - Shipping & Next Steps */}
              <div className="space-y-8">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff]" />
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Truck className="mr-3 h-6 w-6 text-[#667eea]" />
                        Shipping Information
                      </h2>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-[#9902f7] mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {orderDetails.shipping.name}
                            </p>
                            <p className="text-gray-600">
                              {orderDetails.shipping.address}
                            </p>
                            <p className="text-gray-600">
                              {orderDetails.shipping.city},{" "}
                              {orderDetails.shipping.country}{" "}
                              {orderDetails.shipping.postalCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-[#667eea] mt-1" />
                          <div>
                            <p className="text-gray-600">
                              {orderDetails.shipping.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-[#00d4ff] mt-1" />
                          <div>
                            <p className="text-gray-600">
                              {orderDetails.shipping.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9902f7] via-[#667eea] to-[#00d4ff]" />
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Shield className="mr-3 h-6 w-6 text-[#00d4ff]" />
                        What's Next?
                      </h2>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#9902f7]/20 to-[#667eea]/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-[#9902f7]">
                              1
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order Processing
                            </h3>
                            <p className="text-gray-600">
                              We're preparing your items for shipment.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#9902f7]/20 to-[#667eea]/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-[#667eea]">
                              2
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Shipping Notification
                            </h3>
                            <p className="text-gray-600">
                              You'll receive tracking info within 24 hours.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#9902f7]/20 to-[#667eea]/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-[#00d4ff]">
                              3
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Delivery
                            </h3>
                            <p className="text-gray-600">
                              Estimated delivery in 3-5 business days.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="bg-gradient-to-r from-[#9902f7]/5 via-[#667eea]/5 to-[#00d4ff]/5 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                          <strong>Need help?</strong> Contact our support team
                          at{" "}
                          <a
                            href="mailto:support@blossomfitness.com"
                            className="text-[#9902f7] hover:underline"
                          >
                            support@blossomfitness.com
                          </a>{" "}
                          or call{" "}
                          <a
                            href="tel:+2348000000000"
                            className="text-[#9902f7] hover:underline"
                          >
                            +234 800 000 0000
                          </a>
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/shop" className="flex-1 sm:flex-initial">
                <Button
                  className="w-full bg-gradient-to-r from-[#9902f7] to-[#667eea] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-white py-6 text-lg font-bold"
                  size="lg"
                >
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>

              <Link to="/dashboard/orders" className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-[#9902f7] hover:text-[#9902f7] py-6 text-lg"
                  size="lg"
                >
                  <Package className="mr-3 h-5 w-5" />
                  View All Orders
                </Button>
              </Link>

              <Link to="/" className="flex-1 sm:flex-initial">
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-[#9902f7] hover:bg-[#9902f7]/5 py-6 text-lg"
                  size="lg"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>

            {/* Auto Redirect Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                You'll be redirected to your dashboard in{" "}
                <span className="font-bold text-[#9902f7]">{countdown}</span>{" "}
                seconds...
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
