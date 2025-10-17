import { useState, useEffect } from "react";
import { Play, ArrowRight, Zap, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import drBlossomImage from "@/assets/dr_blossom.png";
import heroBackground from "@/assets/hero-real-bg.jpg";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const parallaxRef = useParallax(0.3);

  const heroTexts = [
    "Fun First, Fitness Always",
    "Dance Your Way to Wellness",
    "Join Our Vibrant Community",
    "Transform Through Movement",
  ];

  const subTexts = [
    "Discover the joy of Zumba with Dr. Blossom and Nigeria's most vibrant fitness community",
    "Experience the perfect blend of high-energy dance and effective fitness routines",
    "Connect with motivated fitness enthusiasts who make every workout feel like a celebration",
    "Unleash your potential through dance, nutrition, and holistic wellness programs",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-element"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Side - Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {heroTexts[currentText]}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-in-up stagger-1">
              {subTexts[currentText]}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
              <Link to="/classes">
                <Button size="lg" className="btn-primary text-lg group">
                  Join Our Dance Community
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/virtual-classes">
                <Button size="lg" variant="outline" className="text-lg group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Book Virtual Class
                </Button>
              </Link>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 animate-fade-in-up stagger-3">
              {[
                { number: "1000+", label: "Happy Members" },
                { number: "50+", label: "Weekly Classes" },
                { number: "5+", label: "Years Experience" },
                { number: "100%", label: "Fun Guaranteed" },
              ].map((stat, index) => (
                <div key={index} className="text-left">
                  <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Dr. Blossom Image */}
          <div className="relative lg:flex justify-end hidden animate-fade-in-up stagger-2">
            <div className="relative">
              <img
                src={drBlossomImage}
                alt="Dr. Blossom Maduafokwa - Fitness Instructor"
                className="w-full max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl"
              />
              {/* Decorative floating elements */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-blossom-purple/20 rounded-full blur-3xl animate-float" />
              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-blossom-pink/20 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>

        {/* Features Preview - Below hero content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 animate-fade-in-up stagger-4">
          <div className="glass-card text-left p-6 group hover-lift">
            <div className="bg-gradient-primary p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-heading font-bold mb-2 text-foreground">
              High-Energy Zumba
            </h3>
            <p className="text-sm text-muted-foreground">
              Dance-fitness classes that combine Latin rhythms with effective cardio workouts
            </p>
          </div>

          <div className="glass-card text-left p-6 group hover-lift">
            <div className="bg-gradient-secondary p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-heading font-bold mb-2 text-foreground">
              Premium Wellness
            </h3>
            <p className="text-sm text-muted-foreground">
              Holistic approach including nutrition guidance and lifestyle coaching
            </p>
          </div>

          <div className="glass-card text-left p-6 group hover-lift">
            <div className="bg-gradient-primary p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-heading font-bold mb-2 text-foreground">
              Vibrant Community
            </h3>
            <p className="text-sm text-muted-foreground">
              Connect with like-minded fitness enthusiasts across Nigeria
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-1 h-16 bg-gradient-primary rounded-full opacity-60" />
      </div>
    </section>
  );
};

export default Hero;
