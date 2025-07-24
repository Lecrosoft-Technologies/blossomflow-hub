import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Classes', href: '#classes' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-card' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/8abaadf7-cbec-4610-8043-eb6dc5b87331.png" 
              alt="Blossom's Fitness Hub" 
              className="h-20 w-auto animate-pulse-glow"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Blossom's Fitness Hub
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-300 hover-underline font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/20"
              onClick={() => window.location.href = '/cart'}
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-primary/20"
              onClick={() => window.location.href = '/login'}
            >
              <User className="h-5 w-5" />
            </Button>

            <Button className="btn-primary hidden md:flex" onClick={() => window.location.href = '/contact'}>
              Become Instructor
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="btn-primary mt-4 w-full" onClick={() => window.location.href = '/contact'}>
                Become Instructor
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;