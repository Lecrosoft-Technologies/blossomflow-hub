import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { paymentService } from '@/services/payment';
import { useToast } from '@/hooks/use-toast';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const reference = searchParams.get('reference');
    const token = searchParams.get('token');
    const provider = searchParams.get('provider') || 'paystack';

    if (!reference && !token) {
      setStatus('failed');
      setMessage('Invalid payment reference');
      return;
    }

    try {
      let result;
      
      if (provider === 'paystack' && reference) {
        result = await paymentService.verifyPaystackPayment(reference);
      } else if (provider === 'paypal' && token) {
        result = await paymentService.verifyPayPalPayment(token);
      } else {
        throw new Error('Invalid payment provider');
      }

      if (result.success) {
        setStatus('success');
        setMessage('Payment successful! Your Zoom® links have been sent to your email.');
        
        toast({
          title: 'Payment Successful',
          description: 'Check your email for class access details',
        });

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage(result.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage(error.message || 'Failed to verify payment');
      
      toast({
        title: 'Payment Failed',
        description: 'Please contact support if you were charged',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto max-w-2xl">
          <Card className="bg-white p-12 text-center">
            {status === 'loading' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Loader2 className="w-16 h-16 text-chocolate mx-auto mb-6 animate-spin" />
                <h1 className="text-3xl font-heading font-bold mb-4 text-chocolate">
                  Verifying Payment
                </h1>
                <p className="text-chocolate/70">
                  Please wait while we confirm your payment...
                </p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                </motion.div>
                <h1 className="text-4xl font-heading font-bold mb-4 text-chocolate">
                  Payment Successful!
                </h1>
                <p className="text-xl text-chocolate/80 mb-8">
                  {message}
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-chocolate text-creamish hover:bg-chocolate/90"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
                </motion.div>
                <h1 className="text-4xl font-heading font-bold mb-4 text-chocolate">
                  Payment Failed
                </h1>
                <p className="text-xl text-chocolate/80 mb-8">
                  {message}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/classes')}
                    className="bg-chocolate text-creamish hover:bg-chocolate/90"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    className="border-chocolate text-chocolate hover:bg-chocolate/10"
                  >
                    Contact Support
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentCallback;
