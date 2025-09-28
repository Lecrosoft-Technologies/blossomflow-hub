import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: "Zumba Challenge 2024",
      date: "December 15, 2024",
      location: "Lagos Community Center",
      attendees: "200+ Expected",
      price: "₦2,500"
    },
    {
      title: "Wellness Workshop",
      date: "January 20, 2025",
      location: "Abuja Fitness Hub",
      attendees: "50+ Expected", 
      price: "₦5,000"
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
                Fitness Events
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our exciting fitness challenges and wellness events across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div key={index} className="glass-card p-8 hover-lift">
                <h3 className="text-2xl font-heading font-bold mb-4">{event.title}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-5 h-5 mr-3" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-5 h-5 mr-3" />
                    {event.attendees}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-6">{event.price}</div>
                <Button className="btn-primary w-full">Register Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;