import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Award,
  Heart,
  Users,
  Target,
  Zap,
  Star,
  TrendingUp,
  Globe,
  Sparkles,
  Target as TargetIcon,
  HeartPulse,
  Users2,
  Calendar,
  Music,
  Brain,
  Leaf,
  Target as VisionIcon,
  Rocket,
  Shield,
  CircleDollarSign,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import drBlossomPhoto from "@/assets/_0000_Dr-Blossom-Photo (1).png";
import heroBackground from "@/assets/Home-Hero-section.png";
import teamImage1 from "@/assets/blossom-group1.jpg";
import teamImage2 from "@/assets/blossom-group2.jpg";
import teamImage3 from "@/assets/blossom-group3.jpg";
import teamImage4 from "@/assets/blossom-group4.jpg";

// AnimatedSection Component
const AnimatedSection = ({
  children,
  animation = "fade",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  animation?: string;
  delay?: number;
  className?: string;
}) => {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.8, delay },
    },
    "slide-up": {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
    "slide-right": {
      initial: { opacity: 0, x: -50 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      {...animations[animation]}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const values = [
    {
      icon: Users2,
      title: "Inclusivity",
      description:
        "Everyone belongs here. We celebrate all bodies, all backgrounds.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Passion",
      description: "Energy, joy, and heart in every session we deliver.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      title: "Empowerment",
      description: "Helping people discover strength inside and out.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: HeartPulse,
      title: "Wellness",
      description: "Championing mind-body balance and holistic living.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    {
      label: "Happy Members",
      value: "1000+",
      icon: Users,
      trend: "+25% this year",
    },
    {
      label: "Classes Taught",
      value: "5000+",
      icon: Calendar,
      trend: "20+ weekly",
    },
    {
      label: "Years Experience",
      value: "6+",
      icon: Award,
      trend: "Since 2018",
    },
    {
      label: "Countries Reached",
      value: "4",
      icon: Globe,
      trend: "Across Africa",
    },
  ];

  const timeline = [
    {
      year: "2018",
      title: "The Beginning",
      description:
        "Dr. Blossom started her Zumba® journey, discovering her passion for dance fitness",
      icon: Sparkles,
    },
    {
      year: "2019",
      title: "Certification & Growth",
      description:
        "Became a certified Zumba® instructor and started teaching classes in Lagos",
      icon: Award,
    },
    {
      year: "2020",
      title: "Virtual Expansion",
      description:
        "Pivoted to virtual classes during the pandemic, reaching students across Africa",
      icon: Globe,
    },
    {
      year: "2022",
      title: "Blossom Fitness Hub",
      description:
        "Launched the official fitness hub, offering comprehensive wellness programs",
      icon: Rocket,
    },
    {
      year: "2024",
      title: "International Impact",
      description:
        "Expanded reach to multiple countries with thousands of active members",
      icon: TrendingUp,
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Blossom",
      role: "Founder & Lead Instructor",
      image: drBlossomPhoto,
      description: "Certified Zumba Instructor, Public Health Physician",
    },
    {
      name: "Zumba Crew",
      role: "Fitness Trainers",
      image: teamImage1,
      description: "Certified fitness professionals",
    },
    {
      name: "Wellness Team",
      role: "Health Coaches",
      image: teamImage2,
      description: "Nutrition & lifestyle experts",
    },
    {
      name: "Community Leaders",
      role: "Program Coordinators",
      image: teamImage3,
      description: "Event & outreach specialists",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-purple-900 via-gray-900 to-black">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${heroBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-gray-900/70 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade">
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                About Blossom's Fitness Hub
              </Badge>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Dance. Heal. Transform.
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={0.3}>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transforming lives through the power of dance, wellness, and
                community
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
                  onClick={() => (window.location.href = "/classes")}
                >
                  Join Our Classes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedSection
                key={index}
                animation="scale"
                delay={index * 0.1}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-purple-200">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${
                        stat.icon === Users
                          ? "from-purple-100 to-pink-100"
                          : "from-blue-100 to-cyan-100"
                      } group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                      <div className="text-xs text-purple-600 font-medium mt-1">
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Blossom's Fitness Hub */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    About Blossom's Fitness Hub
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-8" />
              </div>

              <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-xl">
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="text-xl font-semibold text-gray-900 mb-6">
                    Blossom's Fitness Hub was founded by Dr. Blossom Maduafokwa,
                    a certified Zumba Instructor, public health physician,
                    Creative Director, and passionate wellness advocate. With
                    her strong academic background in health and her lifelong
                    love for dance, Dr. Blossom created this space to redefine
                    fitness culture in Nigeria—making movement joyful,
                    inclusive, and transformative.
                  </p>

                  <p className="mb-6">
                    At Blossom's Fitness Hub, we empower individuals through
                    high-energy dance fitness, wellness education, and
                    community-driven initiatives. We believe everyone deserves
                    the opportunity to thrive—regardless of age, size, or
                    background.
                  </p>

                  <div className="bg-white/50 p-6 rounded-xl border border-purple-100 my-8">
                    <p className="text-lg font-medium text-purple-900">
                      "Our core values guide every beat and every step:
                      Inclusivity • Passion • Empowerment • Wellness"
                    </p>
                  </div>

                  <p className="text-lg font-medium text-gray-900">
                    Join Blossom's Fitness Hub as we dance, grow, and
                    transform—one beat, one move, and one life at a time.
                  </p>
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={drBlossomPhoto}
                    alt="Dr. Blossom Maduafokwa"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-bold">6+ Years</div>
                  <div className="text-sm opacity-90">
                    Of Transformative Impact
                  </div>
                </div>
              </div>

              <div>
                <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  Founder Bio
                </Badge>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Dr. Blossom Adaeze Maduafokwa
                </h2>

                <div className="space-y-4 text-gray-700 mb-8">
                  <p className="text-lg">
                    Dr. Blossom Adaeze Maduafokwa is a Consultant Public Health
                    Physician, Creative Director, certified Zumba Instructor,
                    and passionate wellness advocate. Trained at globally
                    renowned institutions—including the Johns Hopkins Bloomberg
                    School of Public Health and Harvard University—she brings a
                    unique blend of scientific expertise, creativity, and
                    movement-based wellness to every space she leads.
                  </p>

                  <p>
                    With a strong foundation in public health and years of
                    clinical and community experience, Dr. Blossom is committed
                    to advancing holistic well-being in Nigeria. Her lifelong
                    love for dance fuels her mission to make fitness joyful,
                    inclusive, and transformational.
                  </p>

                  <p>
                    Through Blossom's Fitness Hub, she blends evidence-based
                    health principles with high-energy dance fitness to empower
                    individuals across all ages and backgrounds. She champions
                    movement as medicine—an avenue for strength, confidence,
                    emotional release, and community connection.
                  </p>

                  <p className="text-lg font-semibold text-purple-900">
                    Dr. Blossom continues to inspire thousands to embrace
                    wellness not as a chore, but as a celebration of life,
                    resilience, and self-expression.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 border-purple-300 text-purple-700"
                  >
                    <TargetIcon className="w-4 h-4 mr-2" />
                    Public Health Physician
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-2 border-purple-300 text-purple-700"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Zumba® Instructor
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-2 border-purple-300 text-purple-700"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Creative Director
                  </Badge>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Our Purpose & Vision
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Driving transformation through intentional wellness and
                  community impact
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection animation="slide-right" delay={0.2}>
                <Card className="p-8 h-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all group">
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl w-fit mb-6">
                    <TargetIcon className="w-8 h-8 text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Mission Statement
                  </h3>
                  <p className="text-white/80 text-lg">
                    Our mission is to empower individuals through dance-based
                    fitness, promote holistic wellness, and support
                    youth-centered community programs. Through joyful movement,
                    accessible fitness experiences, and education rooted in
                    public health, we help people build stronger bodies,
                    healthier minds, and confident lifestyles.
                  </p>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slide-left" delay={0.3}>
                <Card className="p-8 h-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all group">
                  <div className="p-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl w-fit mb-6">
                    <VisionIcon className="w-8 h-8 text-pink-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Vision Statement
                  </h3>
                  <p className="text-white/80 text-lg">
                    To become Nigeria's leading wellness and dance fitness
                    brand—a movement that unites communities, inspires healthier
                    lifestyles, and celebrates the power of joyful movement
                    across all ages.
                  </p>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Our Core Values
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide every step, every beat, and every
                transformation
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection
                key={index}
                animation="slide-up"
                delay={index * 0.1}
              >
                <Card className="p-8 text-center bg-white border border-gray-200 hover:shadow-2xl transition-all duration-500 group hover:border-transparent">
                  <div
                    className={`p-6 rounded-2xl bg-gradient-to-br ${value.color} mb-6 w-fit mx-auto group-hover:scale-110 transition-transform duration-500`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Our Journey
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Milestones that shaped our transformation journey
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500" />

            {timeline.map((item, index) => (
              <AnimatedSection
                key={index}
                animation="slide-up"
                delay={index * 0.1}
              >
                <div
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Year circle */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-xl">
                      {item.year}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-ping opacity-20" />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"
                    }`}
                  >
                    <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <item.icon className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </Card>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Hub */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Meet the Hub
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The passionate team behind Blossom's Fitness Hub
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                key={index}
                animation="scale"
                delay={index * 0.1}
              >
                <Card className="overflow-hidden bg-white border border-gray-200 hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {member.role}
                    </Badge>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="slide-up" delay={0.4}>
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
                onClick={() => (window.location.href = "/contact")}
              >
                Join Our Team
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Transform?
              </Badge>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Join Our Movement
              </h2>

              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Experience the joy of dance fitness and become part of our
                vibrant community
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
                  onClick={() => (window.location.href = "/classes")}
                >
                  Browse Classes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
