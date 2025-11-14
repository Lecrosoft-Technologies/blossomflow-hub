import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

const NewsletterModal = ({ open, onClose }: NewsletterModalProps) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Connect to API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      toast({
        title: 'Welcome to Blossom Fitness!',
        description: 'You\'ve successfully joined our Zumba® community',
      });
      
      setTimeout(() => {
        onClose();
        setSubscribed(false);
        setEmail('');
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-chocolate to-chocolate/90 text-creamish border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-creamish">
            Join the Zumba® Community
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!subscribed ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <p className="text-creamish/90">
                Get exclusive access to new classes, special offers, and fitness tips from Dr. Blossom Maduafokwa
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate/60" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-creamish text-chocolate border-creamish/20 placeholder:text-chocolate/50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-creamish text-chocolate hover:bg-creamish/90 font-semibold"
                >
                  Subscribe Now
                </Button>
              </form>

              <p className="text-xs text-creamish/70 text-center">
                Join over 10,000+ members in our fitness community. Unsubscribe anytime.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Welcome Aboard!</h3>
              <p className="text-creamish/90">
                Check your inbox for a special welcome offer 🎉
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
