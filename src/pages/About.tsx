import { Users, Target, Heart, Award, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { Link } from "react-router-dom";
import gymClass from "@/assets/gym-class.jpg";
import personalTraining from "@/assets/personal-training.jpg";

import blastImage from "@/assets/blossom-group1.jpg";
import yogaImage from "@/assets/blossom-group2.jpg";
import strengthImage from "@/assets/blossom-group3.jpg";
import danceImage from "@/assets/blossom-group4.jpg";
import pilatesImage from "@/assets/blossom-group5.jpg";
import boxingImage from "@/assets/blossom-group8.jpg";
import blossomSingleImage from "@/assets/blossom-single.jpg";
import blossomSingle2Image from "@/assets/blossom-single2.jpg";
import dance from "@/assets/dance-no-logo.jpg";
import eventPics from "@/assets/blossom-event.jpg";
import matureGroup from "@/assets/mature-grop.jpg";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion for Fitness",
      description:
        "We believe fitness is not just about physical strength, but about building mental resilience and confidence.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description:
        "Creating a supportive environment where everyone feels welcomed and motivated to achieve their goals.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal-Oriented",
      description:
        "Every program is designed with clear objectives and measurable results to track your progress.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description:
        "We maintain the highest standards in equipment, training, and customer service.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Head Trainer & Founder",
      image: matureGroup,
      bio: "15+ years of experience in fitness training and nutrition coaching.",
    },
    {
      name: "Mike Rodriguez",
      role: "Strength & Conditioning Coach",
      image: blossomSingleImage,
      bio: "Former professional athlete specializing in strength training and sports performance.",
    },
    {
      name: "Emma Davis",
      role: "Yoga & Wellness Instructor",
      image: personalTraining,
      bio: "Certified yoga instructor focused on mindfulness and holistic wellness.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-primary">Blossom's Fitness</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Blossom’s Fitness is more than just a fitness brand. It’s a
              vibrant community where fun meets fitness through the perfect
              blend of dance, nutrition, and wellness. We believe that staying
              healthy should be joyful, expressive, and empowering. That’s why
              our programs combine the energy of Zumba, the balance of proper
              nutrition, and the power of holistic wellness to help individuals
              look, feel, and live their best.
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
                  Founded by Dr. Blossom Maduafokwa  a passionate Creative
                  Director, certified Zumba Instructor, and wellness advocate.
                  Blossom’s Fitness is driven by the vision to redefine fitness
                  culture in Nigeria. With her background in health and her deep
                  love for dance, Dr. Blossom inspires others to embrace
                  movement as a celebration of life, confidence, and community.
                </p>
                <p>
                  Our mission is to empower individuals through dance fitness,
                  support youth sponsorship programs, and promote healthier
                  lifestyles across Nigeria. We believe everyone deserves the
                  opportunity to thrive — regardless of age, size, or
                  background.
                </p>
                <p>
                  At Blossom’s Fitness, our core values guide everything we do:
                  Inclusivity
                  – Everyone is welcome on the dance floor. Passion
                  – We bring energy and heart to every movement.
                  Empowerment
                  – We help people discover their strength, inside and out.
                  Wellness
                  – We promote holistic living through mind, body, and
                  spirit balance. Join us as we dance, grow, and transform one
                  beat, one move, and one life at a time.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/contact">
                  <Button className="btn-primary">Join Our Community</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={eventPics}
                alt="Group fitness class"
                className="rounded-lg hover-scale"
              />
              <img
                src={blossomSingleImage}
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
              These core principles guide everything we do and shape the
              experience we create for our members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="card-glass p-6 text-center hover-scale"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
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
              Our certified trainers and wellness experts are here to guide you
              on your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="card-glass overflow-hidden hover-scale"
              >
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
