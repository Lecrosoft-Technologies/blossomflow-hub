import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-foreground">Get In</span>{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Ready to start your fitness journey? Have questions about our classes or products? 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div className="card-glass p-8 border border-primary/20">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-primary p-3 rounded-xl mr-4">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Send us a Message</h2>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input placeholder="Your first name" className="border-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input placeholder="Your last name" className="border-primary/20 focus:border-primary" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your.email@example.com" className="border-primary/20 focus:border-primary" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input type="tel" placeholder="+1 (555) 123-4567" className="border-primary/20 focus:border-primary" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="How can we help you?" className="border-primary/20 focus:border-primary" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Tell us more about your fitness goals or questions..." 
                      rows={6}
                      className="border-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                  
                  <Button className="btn-primary w-full group">
                    Send Message
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="card-glass p-8 border border-secondary/20">
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-primary p-3 rounded-xl">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Phone</h4>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-muted-foreground">+1 (555) 987-6543</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-secondary p-3 rounded-xl">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-muted-foreground">info@blossomsfitness.com</p>
                        <p className="text-muted-foreground">support@blossomsfitness.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-primary p-3 rounded-xl">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Address</h4>
                        <p className="text-muted-foreground">123 Fitness Street</p>
                        <p className="text-muted-foreground">Health City, HC 12345</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-secondary p-3 rounded-xl">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Hours</h4>
                        <p className="text-muted-foreground">Mon - Fri: 6:00 AM - 10:00 PM</p>
                        <p className="text-muted-foreground">Sat - Sun: 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructor Application CTA */}
                <div className="card-glass p-8 border border-primary/20 text-center bg-gradient-primary/5">
                  <h3 className="text-2xl font-bold mb-4">Become an Instructor</h3>
                  <p className="text-muted-foreground mb-6">
                    Join our team of passionate fitness professionals and help transform lives. 
                    We're always looking for certified trainers who share our vision.
                  </p>
                  <Button className="btn-primary">
                    Apply Now
                  </Button>
                </div>

                {/* Quick Contact */}
                <div className="card-glass p-8 border border-cyber-blue/20 text-center">
                  <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
                  <p className="text-muted-foreground mb-6">
                    For urgent matters or technical support, reach out to us directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="border-cyber-blue/50 hover:bg-cyber-blue/10 flex-1">
                      Live Chat
                    </Button>
                    <Button variant="outline" className="border-energy-green/50 hover:bg-energy-green/10 flex-1">
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;