import { useState, useEffect } from "react";
import { Play, ArrowRight, Zap, Star, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import drBlossomImage from "@/assets/dr-blossom.png";
import heroBackground from "@/assets/hero-real-bg.jpg";
import twirlPattern from "@/assets/Twirl-line.png";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);

  const heroTexts = [
    "Fun First, Fitness Always",
    "Dance Your Way to Wellness",
    "Join Our Vibrant Community",
    "Transform Through Movement",
  ];

  const subTexts = [
    "Discover the joy of Zumba® with Dr. Blossom and Nigeria's most vibrant fitness community",
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-bg">
      {/* Background - Solid chocolate color */}
      <div className="absolute inset-0 bg-hero-bg" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <div className="text-left space-y-8 mt-[-12rem] ">
            {/* Main Headline */}
            <h1 className="hero-text animate-fade-in-up text-hero-text">
              {heroTexts[currentText]}
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-hero-text/80 max-w-xl animate-fade-in-up stagger-1">
              {subTexts[currentText]}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
              <Link to="/classes">
                <Button
                  size="default"
                  className="bg-creamish text-chocolate hover:bg-creamish/90 text-lg group"
                >
                  Join Our Zumba® Community
                  <ArrowRight className="ml-2 h-5 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/virtual-classes">
                <Button
                  size="default"
                  variant="outline"
                  className="bg-white text-chocolate border-white hover:bg-white/90 text-lg group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Book a Class
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Dr. Blossom Image with Floating Stats */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up stagger-2">
            <div className="relative">
              {/* Twirl Pattern Background */}
              {/* <div
                className="absolute inset-0 opacity-30 pointer-events-none z-0"
                style={{
                  backgroundImage: `url(${twirlPattern})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              /> */}

              <img
                src={drBlossomImage}
                alt="Dr. Blossom Maduafokwa - Fitness Instructor"
                className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl"
              />

              {/* Floating Stat Cards */}
              <div className="absolute top-[15%] -left-8 glass-card p-4 rounded-xl shadow-lg animate-float bg-creamish/90 border-creamish">
                <div className="text-3xl font-heading font-bold text-chocolate">
                  1000+
                </div>
                <div className="text-sm text-chocolate/70 font-medium whitespace-nowrap">
                  Happy Members
                </div>
              </div>

              {/* <div
                className="absolute top-[35%] -right-4 glass-card p-4 rounded-xl shadow-lg animate-float z-10"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                  Weekly Classes
                </div>
              </div> */}

              <div
                className="absolute bottom-[30%] -left-12 glass-card p-4 rounded-xl shadow-lg animate-float z-10 bg-creamish/90 border-creamish"
                style={{ animationDelay: "1s" }}
              >
                <div className="text-3xl font-heading font-bold text-chocolate">
                  6+
                </div>
                <div className="text-sm text-chocolate/70 font-medium whitespace-nowrap">
                  Years Experience
                </div>
              </div>

              {/* <div
                className="absolute bottom-[10%] right-0 glass-card p-4 rounded-xl shadow-lg animate-float z-10"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                  Fun Guaranteed
                </div>
              </div> */}

              {/* Decorative floating elements */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-creamish/30 rounded-full blur-3xl animate-float" />
              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-creamish/20 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
