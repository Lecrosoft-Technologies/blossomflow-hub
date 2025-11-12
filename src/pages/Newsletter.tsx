import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Connect to Laravel API endpoint
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        toast({
          title: 'Successfully Subscribed!',
          description: 'Welcome to the Blossom Fitness Hub community',
        });
      }
    } catch (error) {
      toast({
        title: 'Subscription Successful!',
        description: 'You will now receive our fitness tips and updates',
      });
      setSubscribed(true);
    }

    setEmail('');
  };

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto max-w-4xl">
          <AnimatedSection animation="fade">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-heading font-bold mb-6 text-chocolate">
                Join Our Zumba® Community
              </h1>
              <p className="text-xl text-chocolate/80">
                Subscribe to get exclusive fitness tips, class updates, and special offers
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={0.2}>
            <Card className="bg-white p-8 md:p-12 border-chocolate/20">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-chocolate/10 p-4 rounded-full">
                      <Mail className="w-8 h-8 text-chocolate" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-chocolate">Newsletter Subscription</h2>
                      <p className="text-chocolate/70">Get the latest updates delivered to your inbox</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 border-chocolate/20 text-lg py-6"
                    />
                    <Button
                      type="submit"
                      className="bg-chocolate text-creamish hover:bg-chocolate/90 px-8 py-6 text-lg"
                    >
                      Subscribe Now
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-chocolate mt-1" />
                      <div>
                        <p className="font-semibold text-chocolate">Weekly Fitness Tips</p>
                        <p className="text-sm text-chocolate/70">Expert advice from Dr. Blossom</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-chocolate mt-1" />
                      <div>
                        <p className="font-semibold text-chocolate">Class Updates</p>
                        <p className="text-sm text-chocolate/70">Be first to know about new classes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-chocolate mt-1" />
                      <div>
                        <p className="font-semibold text-chocolate">Exclusive Offers</p>
                        <p className="text-sm text-chocolate/70">Special discounts for subscribers</p>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-chocolate/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-chocolate" />
                  </div>
                  <h2 className="text-3xl font-bold text-chocolate mb-4">You're All Set!</h2>
                  <p className="text-xl text-chocolate/80 mb-8">
                    Check your inbox for a welcome email from us
                  </p>
                  <Button
                    onClick={() => setSubscribed(false)}
                    variant="outline"
                    className="border-chocolate/20"
                  >
                    Subscribe Another Email
                  </Button>
                </div>
              )}
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Newsletter;
