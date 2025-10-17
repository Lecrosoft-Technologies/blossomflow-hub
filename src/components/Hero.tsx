import { useState, useEffect } from "react";
import { Play, ArrowRight, Zap, Star, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import drBlossomHero from "@/assets/hero-bg-with-coach.png";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Hero Image */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat  parallax-element"
          style={{ backgroundImage: `url(${drBlossomHero})` }}
        />

        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" /> */}

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blossom-purple/20 rounded-full blur-3xl animate-float parallax-slow" />
          <div
            className="absolute top-40 right-20 w-48 h-48 bg-blossom-pink/20 rounded-full blur-3xl animate-float parallax-medium"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-20 left-1/4 w-40 h-40 bg-blossom-coral/20 rounded-full blur-3xl animate-float parallax-fast"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="absolute bottom-40 right-10 w-24 h-24 bg-blossom-mint/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom mx-auto px-4 text-center pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Brand Badge */}
          {/* <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-full">
              <Heart className="w-5 h-5 text-blossom-purple" />
              <span className="font-accent font-medium text-blossom-purple">
                Led by Dr. Blossom Maduafokwa
              </span>
            </div>
          </div> */}

          

          {/* Main Headline */}
          <h1 className="hero-text mb-8 animate-fade-in-up stagger-1">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {heroTexts[currentText]}
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle mb-12 animate-fade-in-up stagger-2">
            {subTexts[currentText]}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up stagger-3">
            <Link to="/classes">
              <Button className="btn-primary text-lg group">
                Join Our Dance Community
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/virtual-classes">
              <Button className="btn-outline text-lg group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Book Virtual Class
              </Button>
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in-up stagger-4">
            <div className="glass-card text-center p-8 group hover-lift">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-soft">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">
                High-Energy Zumba
              </h3>
              <p className="text-muted-foreground">
                Dance-fitness classes that combine Latin rhythms with effective
                cardio workouts
              </p>
            </div>

            <div className="glass-card text-center p-8 group hover-lift">
              <div className="bg-gradient-secondary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-soft">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">
                Premium Wellness
              </h3>
              <p className="text-muted-foreground">
                Holistic approach including nutrition guidance and lifestyle
                coaching
              </p>
            </div>

            <div className="glass-card text-center p-8 group hover-lift">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-soft">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">
                Vibrant Community
              </h3>
              <p className="text-muted-foreground">
                Connect with like-minded fitness enthusiasts across Nigeria
              </p>
            </div>
          </div>

          {/* Success Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up stagger-4">
            {[
              { number: "1000+", label: "Happy Members" },
              { number: "50+", label: "Weekly Classes" },
              { number: "5+", label: "Years Experience" },
              { number: "100%", label: "Fun Guaranteed" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
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
