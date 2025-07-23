import { useState, useEffect } from 'react';
import { Play, ArrowRight, Zap, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  
  const heroTexts = [
    "Transform Your Body",
    "Elevate Your Mind",
    "Unleash Your Power",
    "Live Your Best Life"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyber-blue/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-energy-green/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Stats Bar */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="card-glass text-center px-4 py-2">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div className="card-glass text-center px-4 py-2">
              <div className="text-2xl font-bold text-secondary">50+</div>
              <div className="text-sm text-muted-foreground">Classes</div>
            </div>
            <div className="card-glass text-center px-4 py-2">
              <div className="text-2xl font-bold text-cyber-blue">24/7</div>
              <div className="text-sm text-muted-foreground">Access</div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {heroTexts[currentText]}
            </span>
            <br />
            <span className="text-foreground">
              With Blossom's
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the ultimate fitness revolution. Virtual classes, premium products, and cutting-edge technology all in one platform. Your transformation starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button className="btn-primary text-lg px-8 py-4 group">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" className="text-lg px-8 py-4 bg-transparent border-primary/50 hover:bg-primary/10 group">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-glass text-center p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-primary p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">High-Energy Classes</h3>
              <p className="text-muted-foreground text-sm">Live and on-demand workouts that push your limits</p>
            </div>

            <div className="card-glass text-center p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-secondary p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Products</h3>
              <p className="text-muted-foreground text-sm">Curated fitness gear and supplements</p>
            </div>

            <div className="card-glass text-center p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-primary p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Power</h3>
              <p className="text-muted-foreground text-sm">Connect with motivated fitness enthusiasts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
        <div className="w-1 h-16 bg-gradient-primary rounded-full opacity-60"></div>
      </div>
    </section>
  );
};

export default Hero;