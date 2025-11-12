import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Award, Heart, Users, Target, Zap, Star, TrendingUp, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import drBlossomPhoto from '@/assets/_0000_Dr-Blossom-Photo (1).png';
import heroBackground from '@/assets/bg-hero-blossom.png';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Fun First',
      description: 'We believe fitness should be joyful, not a chore',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive network of wellness warriors',
    },
    {
      icon: Target,
      title: 'Results',
      description: 'Proven methods that deliver real transformation',
    },
    {
      icon: Zap,
      title: 'Energy',
      description: 'High-energy workouts that make you feel alive',
    },
  ];

  const stats = [
    { label: 'Happy Members', value: '1000+', icon: Users },
    { label: 'Classes Taught', value: '5000+', icon: Star },
    { label: 'Years Experience', value: '6+', icon: Award },
    { label: 'Countries Reached', value: '4', icon: Globe },
  ];

  const timeline = [
    {
      year: '2018',
      title: 'The Beginning',
      description: 'Dr. Blossom started her Zumba® journey, discovering her passion for dance fitness',
    },
    {
      year: '2019',
      title: 'Certification & Growth',
      description: 'Became a certified Zumba® instructor and started teaching classes in Lagos',
    },
    {
      year: '2020',
      title: 'Virtual Expansion',
      description: 'Pivoted to virtual classes during the pandemic, reaching students across Africa',
    },
    {
      year: '2022',
      title: 'Blossom Fitness Hub',
      description: 'Launched the official fitness hub, offering comprehensive wellness programs',
    },
    {
      year: '2024',
      title: 'International Impact',
      description: 'Expanded reach to multiple countries with thousands of active members',
    },
  ];

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      {/* Hero Section with Background */}
      <section 
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-chocolate/50" />
        <div className="relative z-10 container-custom mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-heading font-bold mb-6 text-creamish drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Dr. Blossom
          </motion.h1>
          <motion.p 
            className="text-xl text-creamish/90 max-w-3xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transforming lives through the power of dance, wellness, and community
          </motion.p>
        </div>
      </section>

      {/* Dr. Blossom's Story */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <AnimatedSection animation="fade">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <img
                    src={drBlossomPhoto}
                    alt="Dr. Blossom Maduafokwa"
                    className="rounded-2xl shadow-2xl w-full object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-chocolate text-creamish p-6 rounded-xl shadow-xl">
                    <p className="text-4xl font-bold">6+</p>
                    <p className="text-sm">Years of Impact</p>
                  </div>
                </motion.div>
              </div>

              {/* Story */}
              <div className="space-y-6">
                <AnimatedSection animation="slide-right">
                  <h2 className="text-4xl font-heading font-bold text-chocolate mb-6">
                    Meet Dr. Blossom Maduafokwa
                  </h2>
                  
                  <div className="prose prose-lg text-chocolate/80 space-y-4">
                    <p>
                      Dr. Blossom Maduafokwa is not just a Zumba® instructor—she's a movement builder, 
                      a wellness advocate, and a passionate believer in the transformative power of dance.
                    </p>
                    
                    <p>
                      With over 6 years of experience and thousands of students across multiple countries, 
                      Dr. Blossom has built a reputation for creating high-energy, inclusive fitness 
                      experiences that celebrate every body and every fitness level.
                    </p>
                    
                    <p>
                      Her unique approach combines the joy of Latin dance rhythms with effective fitness 
                      techniques, creating workouts that don't feel like work. From Lagos to Monrovia, 
                      from virtual classes to in-person sessions, Dr. Blossom's infectious energy and 
                      genuine care for her students have transformed the lives of over 1,000 members.
                    </p>
                    
                    <p className="font-semibold text-chocolate">
                      "Fitness should be fun first. When you love what you do, results follow naturally." 
                      - Dr. Blossom
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-creamish">
        <div className="container-custom mx-auto">
          <AnimatedSection animation="fade">
            <h2 className="text-4xl font-heading font-bold text-center text-chocolate mb-16">
              The Journey
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <AnimatedSection key={index} animation="slide-up" delay={index * 0.1}>
                <div className="flex gap-6 mb-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-chocolate text-creamish flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {item.year}
                    </div>
                    {index !== timeline.length - 1 && (
                      <div className="w-1 h-full bg-chocolate/20 mt-2" />
                    )}
                  </div>
                  <Card className="flex-1 p-6 bg-white border-chocolate/20 hover:shadow-xl transition-all">
                    <h3 className="text-2xl font-bold text-chocolate mb-2">{item.title}</h3>
                    <p className="text-chocolate/70">{item.description}</p>
                  </Card>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} animation="scale" delay={index * 0.1}>
                <Card className="p-8 text-center bg-gradient-to-br from-chocolate to-chocolate/80 text-creamish hover:shadow-2xl transition-all">
                  <stat.icon className="w-12 h-12 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-creamish/90">{stat.label}</div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-creamish">
        <div className="container-custom mx-auto">
          <AnimatedSection animation="fade">
            <h2 className="text-4xl font-heading font-bold text-center text-chocolate mb-16">
              Our Core Values
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={index} animation="slide-up" delay={index * 0.1}>
                <Card className="p-8 text-center bg-white border-chocolate/20 hover:shadow-xl transition-all group">
                  <div className="bg-chocolate/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-chocolate group-hover:text-creamish transition-all">
                    <value.icon className="w-8 h-8 text-chocolate group-hover:text-creamish transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-chocolate mb-3">{value.title}</h3>
                  <p className="text-chocolate/70">{value.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
