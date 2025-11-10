import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo_dark_mode_cream_color.png";

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={logo}
          alt="Blossom's Fitness Hub"
          className="h-24 md:h-32 w-auto animate-pulse"
        />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
