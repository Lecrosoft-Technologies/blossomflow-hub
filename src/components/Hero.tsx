import { useState, useEffect } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import drBlossomImage from "@/assets/dr-blossom.png";
import heroBackground from "@/assets/Home-Hero-section.png";

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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Lilac/Dim Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Lilac/Soft Purple Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-lilac/40 to-purple-800/20" />
        {/* Additional dim overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <motion.div
            className="text-left space-y-6 md:space-y-8 lg:mt-0 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Headline */}
            <h1 className="hero-text text-white drop-shadow-lg">
              {heroTexts[currentText]}
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl drop-shadow">
              {subTexts[currentText]}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/newsletter">
                <Button
                  size="default"
                  className="bg-white text-primary hover:bg-creamish/90 text-sm md:text-lg group shadow-lg w-full sm:w-auto"
                >
                  Join Our Zumba® Community
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/classes">
                <Button
                  size="default"
                  variant="outline"
                  className="bg-white text-primary border-white hover:bg-white/90 text-sm md:text-lg group shadow-lg w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                  Book a Class
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Dr. Blossom Image with Floating Stats */}
          <motion.div
            className="relative flex justify-center lg:justify-end order-first lg:order-last"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src={drBlossomImage}
                alt="Dr. Blossom Maduafokwa - Zumba® Fitness Instructor"
                className="relative z-10 w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-2xl mx-auto"
              />

              {/* Floating Stat Cards - Now using bounce animation only */}
              <motion.div
                className="absolute top-[10%] sm:top-[15%] -left-4 sm:-left-8 glass-card p-3 sm:p-4 rounded-xl shadow-lg bg-creamish/90 border-creamish z-20"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-primary">
                  1000+
                </div>
                <div className="text-xs sm:text-sm text-chocolate/70 font-medium whitespace-nowrap">
                  Happy Members
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-[25%] sm:bottom-[30%] -left-8 sm:-left-12 glass-card p-3 sm:p-4 rounded-xl shadow-lg bg-creamish/90 border-creamish z-20"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-primary">
                  7+
                </div>
                <div className="text-xs sm:text-sm text-chocolate/70 font-medium whitespace-nowrap">
                  Years Experience
                </div>
              </motion.div>

              {/* Decorative floating elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-creamish/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -right-6 w-28 h-28 sm:w-40 sm:h-40 bg-creamish/15 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
