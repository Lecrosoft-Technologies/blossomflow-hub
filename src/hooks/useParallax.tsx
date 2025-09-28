import { useEffect, useRef } from 'react';

export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Check if element is in viewport
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = -(scrolled - elementTop) * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
};

export const useParallaxMultiple = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      // Different parallax speeds for different elements
      const slowElements = document.querySelectorAll('.parallax-slow');
      const mediumElements = document.querySelectorAll('.parallax-medium');
      const fastElements = document.querySelectorAll('.parallax-fast');

      slowElements.forEach((el) => {
        const speed = 0.2;
        const yPos = -(scrolled * speed);
        (el as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });

      mediumElements.forEach((el) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        (el as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });

      fastElements.forEach((el) => {
        const speed = 0.8;
        const yPos = -(scrolled * speed);
        (el as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};