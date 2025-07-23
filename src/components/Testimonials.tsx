import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "Blossom's Fitness Hub completely transformed my workout routine! The virtual classes are so engaging and the community support is incredible. I've never felt stronger!",
      achievement: "Lost 25 lbs in 3 months"
    },
    {
      id: 2,
      name: "Marcus Davis",
      role: "Professional Athlete",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "The variety of classes and expert instructors here are top-notch. As a professional athlete, I need quality training, and Blossom's delivers every time.",
      achievement: "Improved performance by 40%"
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Busy Mom",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "With two kids and a full-time job, I thought fitness was impossible. The flexible schedule and home workouts saved my sanity and health!",
      achievement: "Found work-life balance"
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Fitness Beginner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "I was intimidated by gyms, but the welcoming community and beginner-friendly classes gave me confidence. Now I'm stronger than ever!",
      achievement: "Gained confidence & strength"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Yoga Instructor",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "Even as an instructor myself, I learn so much from the diverse classes offered. The platform is intuitive and the content quality is exceptional.",
      achievement: "Enhanced teaching skills"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Corporate Executive",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      text: "The convenience of working out on my schedule while maintaining quality instruction is game-changing. Stress levels down, energy up!",
      achievement: "Reduced stress, increased energy"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-foreground">What Our</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Members Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who transformed their lives with Blossom's Fitness Hub
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="card-glass p-8 md:p-12 text-center relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-primary/20 text-6xl font-serif">"</div>
            
            {/* Current Testimonial */}
            <div className="space-y-6">
              {/* Stars */}
              <div className="flex justify-center space-x-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
                {testimonials[currentIndex].text}
              </blockquote>

              {/* Achievement Badge */}
              <div className="inline-block bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                ✨ {testimonials[currentIndex].achievement}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4 pt-4">
                <img 
                  src={testimonials[currentIndex].avatar} 
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:-left-12">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground shadow-card"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:-right-12">
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground shadow-card"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">
              500+
            </div>
            <p className="text-muted-foreground">Happy Members</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black bg-gradient-secondary bg-clip-text text-transparent mb-2">
              4.9
            </div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">
              1M+
            </div>
            <p className="text-muted-foreground">Workouts Completed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black bg-gradient-secondary bg-clip-text text-transparent mb-2">
              98%
            </div>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;