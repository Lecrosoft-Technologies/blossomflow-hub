import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call - replace with actual authentication
    try {
      // TODO: Replace with actual API call to Laravel backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Blossom's Fitness Hub!",
      });
      
      // Redirect to home or dashboard
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your Blossom's Fitness Hub account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="link"
                  className="px-0 text-primary hover:text-primary-glow"
                  onClick={() => window.location.href = '/forgot-password'}
                >
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button
                  variant="link"
                  className="px-0 text-primary hover:text-primary-glow"
                  onClick={() => window.location.href = '/signup'}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;