import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call - replace with actual password reset
    try {
      // TODO: Replace with actual API call to Laravel backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="card-glass border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or click resend.
              </div>
              
              <Button 
                className="w-full btn-primary"
                onClick={() => setSent(false)}
              >
                Resend Email
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary-glow"
                  onClick={() => window.location.href = '/login'}
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-white hover:bg-white/10"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="card-glass border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <img 
                src="/lovable-uploads/8abaadf7-cbec-4610-8043-eb6dc5b87331.png" 
                alt="Blossom's Fitness Hub" 
                className="h-12 w-12"
              />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary-glow"
                  onClick={() => window.location.href = '/login'}
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;