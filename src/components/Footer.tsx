import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/blossomsfitnesshub', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/blossomsfitnesshub', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com/blossomsfitnesshub', label: 'YouTube' },
    { icon: Twitter, href: 'https://twitter.com/blossomsfitnesshub', label: 'X (Twitter)' }
  ];

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Virtual Classes', href: '#classes' },
    { label: 'Membership Plans', href: '#pricing' },
    { label: 'Personal Training', href: '#training' },
    { label: 'Nutrition Coaching', href: '#nutrition' },
    { label: 'Corporate Wellness', href: '#corporate' }
  ];

  const supportLinks = [
    { label: 'Help Center', href: '#help' },
    { label: 'Contact Support', href: '#support' },
    { label: 'Class Schedule', href: '#schedule' },
    { label: 'Booking Policy', href: '#policy' },
    { label: 'Refund Policy', href: '#refunds' },
    { label: 'Technical Support', href: '#tech' }
  ];

  const shopLinks = [
    { label: 'Fitness Equipment', href: '#equipment' },
    { label: 'Supplements', href: '#supplements' },
    { label: 'Workout Apparel', href: '#apparel' },
    { label: 'Accessories', href: '#accessories' },
    { label: 'Gift Cards', href: '#gifts' },
    { label: 'New Arrivals', href: '#new' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/8abaadf7-cbec-4610-8043-eb6dc5b87331.png" 
                  alt="Blossom's Fitness Hub" 
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Blossom's Fitness Hub
                  </h3>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                Transform your body, elevate your mind. Join thousands of members on their fitness journey with cutting-edge virtual classes and premium products.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">123 Fitness Street, Wellness City, WC 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">+1 (555) 123-FITNESS</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">hello@blossomsfitnesshub.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <a 
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Shop</h4>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Blossom's Fitness Hub. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors hover-underline">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors hover-underline">
                Terms of Service
              </a>
              <a href="#cookies" className="text-muted-foreground hover:text-primary transition-colors hover-underline">
                Cookie Policy
              </a>
              <a href="#accessibility" className="text-muted-foreground hover:text-primary transition-colors hover-underline">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;