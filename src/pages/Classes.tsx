import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Star } from 'lucide-react';

const Classes = () => {
  const classes = [
    {
      name: "Zumba Fitness",
      time: "Mon, Wed, Fri - 6:00 PM",
      duration: "60 min",
      level: "All Levels",
      price: "₦5,000/month"
    },
    {
      name: "Dance Cardio",
      time: "Tue, Thu - 7:00 PM", 
      duration: "45 min",
      level: "Beginner",
      price: "₦4,000/month"
    },
    {
      name: "Wellness Coaching",
      time: "Saturdays - 10:00 AM",
      duration: "90 min", 
      level: "All Levels",
      price: "₦8,000/month"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Fitness Classes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join Dr. Blossom and discover the joy of dance fitness with our high-energy Zumba classes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classes.map((classItem, index) => (
              <div key={index} className="glass-card p-8 hover-lift">
                <h3 className="text-2xl font-heading font-bold mb-4">{classItem.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-5 h-5 mr-3" />
                    {classItem.time}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-5 h-5 mr-3" />
                    {classItem.duration}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-5 h-5 mr-3" />
                    {classItem.level}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-6">{classItem.price}</div>
                <Button className="btn-primary w-full">Book Class</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Classes;