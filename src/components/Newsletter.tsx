import { useState, useEffect } from "react";
import { Mail, Gift, Zap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(10234);

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const count = await apiService.getSubscriberCount();
      if (count > 0) {
        setSubscriberCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch subscriber count:", error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const subscription = await apiService.subscribeToNewsletter(email, name);

      if (subscription) {
        setIsSubscribed(true);
        setEmail("");
        setName("");

        toast({
          title: "Subscription Successful!",
          description:
            "Welcome to our fitness community! Check your email for a welcome gift.",
        });

        // Update subscriber count
        fetchSubscriberCount();

        // Reset subscription status after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false);
        }, 5000);
      } else {
        toast({
          title: "Subscription Failed",
          description: "Unable to subscribe. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute bottom-20 right-1/3 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Stay in the <span className="text-yellow-300">Loop</span>
            </h2>

            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Get exclusive workout tips, new class alerts, product launches,
              and member-only deals delivered straight to your inbox.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Exclusive Offers
              </h3>
              <p className="text-white/70 text-sm">
                Get early access to sales and member-only discounts
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Fresh Content
              </h3>
              <p className="text-white/70 text-sm">
                Be first to know about new classes and challenges
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Weekly Tips
              </h3>
              <p className="text-white/70 text-sm">
                Expert nutrition and fitness advice in your inbox
              </p>
            </div>
          </div>

          {/* Subscription Form */}
          <div className="max-w-md mx-auto">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm h-12"
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm h-12"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 group"
                    disabled={loading}
                  >
                    {loading ? "Subscribing..." : "Subscribe"}
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <p className="text-white/60 text-sm mt-3">
                  Join {subscriberCount.toLocaleString()}+ fitness enthusiasts.
                  Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 animate-scale-in">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to the Family!
                </h3>
                <p className="text-white/80">
                  Check your inbox for a special welcome gift and your first
                  dose of fitness inspiration!
                </p>
              </div>
            )}
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{subscriberCount.toLocaleString()} subscribers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Weekly newsletter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>No spam, ever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
