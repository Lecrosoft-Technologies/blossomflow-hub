import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Heart, Award, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">About</span>{' '}
              <span className="text-foreground">Blossom's</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're not just a fitness hub - we're a movement. A community of passionate individuals 
              transforming lives through the power of fitness, technology, and human connection.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="card-glass p-8 border border-primary/20">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-primary p-3 rounded-xl mr-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize the fitness industry by making high-quality workouts, premium products, 
                  and expert guidance accessible to everyone, anywhere, anytime. We believe fitness should 
                  be fun, inclusive, and transformative.
                </p>
              </div>

              <div className="card-glass p-8 border border-secondary/20">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-secondary p-3 rounded-xl mr-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To create a global community where fitness becomes a lifestyle, not a chore. 
                  We envision a world where everyone has the tools, motivation, and support 
                  to achieve their best self.
                </p>
              </div>
            </div>

            <div className="card-glass p-8 text-center">
              <div className="bg-gradient-primary p-6 rounded-2xl w-fit mx-auto mb-6 shadow-glow">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">5000+ Members Strong</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands who have already transformed their lives with Blossom's
              </p>
              <Button className="btn-primary">
                Become an Instructor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the community we're building
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We constantly push boundaries, embracing new technology and methods to enhance your fitness journey.
              </p>
            </div>

            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-secondary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-muted-foreground">
                Every member matters. We build genuine connections and support each other's growth.
              </p>
            </div>

            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We're committed to delivering the highest quality in everything - from classes to customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to your fitness success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
              <p className="text-primary font-semibold mb-3">Founder & Head Trainer</p>
              <p className="text-muted-foreground text-sm">
                15+ years in fitness, certified nutritionist, and passionate about empowering others.
              </p>
            </div>

            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mike Chen</h3>
              <p className="text-secondary font-semibold mb-3">Lead Instructor</p>
              <p className="text-muted-foreground text-sm">
                Former Olympic trainer specializing in HIIT and strength training programs.
              </p>
            </div>

            <div className="card-glass text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Emma Davis</h3>
              <p className="text-primary font-semibold mb-3">Wellness Coach</p>
              <p className="text-muted-foreground text-sm">
                Mental health advocate focused on holistic wellness and mindful movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;