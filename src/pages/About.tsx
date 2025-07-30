import { Users, Target, Heart, Award, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import { Link } from 'react-router-dom';
import gymClass from '@/assets/gym-class.jpg';
import personalTraining from '@/assets/personal-training.jpg';

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion for Fitness",
      description: "We believe fitness is not just about physical strength, but about building mental resilience and confidence."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description: "Creating a supportive environment where everyone feels welcomed and motivated to achieve their goals."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal-Oriented",
      description: "Every program is designed with clear objectives and measurable results to track your progress."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We maintain the highest standards in equipment, training, and customer service."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Head Trainer & Founder",
      image: personalTraining,
      bio: "15+ years of experience in fitness training and nutrition coaching."
    },
    {
      name: "Mike Rodriguez",
      role: "Strength & Conditioning Coach",
      image: gymClass,
      bio: "Former professional athlete specializing in strength training and sports performance."
    },
    {
      name: "Emma Davis",
      role: "Yoga & Wellness Instructor",
      image: personalTraining,
      bio: "Certified yoga instructor focused on mindfulness and holistic wellness."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-primary">FitLife</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Founded with the vision of making fitness accessible and enjoyable for everyone, 
              FitLife has been transforming lives through personalized training, community support, 
              and cutting-edge facilities for over a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  What started as a small neighborhood gym has grown into a thriving fitness community. 
                  Our founder, Sarah Johnson, opened FitLife with a simple mission: to create a space 
                  where people of all fitness levels could feel comfortable pursuing their health goals.
                </p>
                <p>
                  Today, we're proud to serve hundreds of members with state-of-the-art equipment, 
                  expert trainers, and a variety of programs that cater to every fitness journey. 
                  From beginners taking their first steps toward wellness to athletes pushing their limits, 
                  FitLife is home to everyone.
                </p>
                <p>
                  Our commitment extends beyond physical fitness. We believe in building mental strength, 
                  fostering community connections, and supporting sustainable lifestyle changes that 
                  last a lifetime.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/contact">
                  <Button className="btn-primary">
                    Join Our Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={gymClass} 
                alt="Group fitness class" 
                className="rounded-lg hover-scale"
              />
              <img 
                src={personalTraining} 
                alt="Personal training session" 
                className="rounded-lg hover-scale mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-r from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core principles guide everything we do and shape the experience we create for our members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="card-glass p-6 text-center hover-scale">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our certified trainers and wellness experts are here to guide you on your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="card-glass overflow-hidden hover-scale">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Happy Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-white/80">Group Classes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-white/80">Expert Trainers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;