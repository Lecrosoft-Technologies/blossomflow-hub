import { useState, useEffect } from 'react';
import { Play, ArrowRight, Zap, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-fitness-lady.jpg';

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
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyber-blue/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-energy-green/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-32">
        <div className="max-w-5xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight mt-16">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16 mb-24">
            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300 border border-primary/20">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">High-Energy Classes</h3>
              <p className="text-muted-foreground">Live and on-demand workouts that push your limits and transform your body</p>
            </div>

            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300 border border-secondary/20">
              <div className="bg-gradient-secondary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Premium Products</h3>
              <p className="text-muted-foreground">Curated fitness gear and supplements to fuel your journey</p>
            </div>

            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300 border border-primary/20">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Community Power</h3>
              <p className="text-muted-foreground">Connect with motivated fitness enthusiasts worldwide</p>
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