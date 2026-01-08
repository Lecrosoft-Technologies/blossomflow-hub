import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/purple_logo.png";
import logoWhite from "@/assets/blossom-logo-white.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Classes", href: "/classes" },
    { label: "News & Article", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  // Admin navigation items - shown only on admin pages
  const adminNavItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Classes", href: "/admin#classes" },
    { label: "Products", href: "/admin#products" },
    { label: "Users", href: "/admin#users" },
    { label: "Back to Site", href: "/" },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest("header")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Determine header state - on admin pages, always show solid background
  const showSolidBackground = isAdminPage || isScrolled;
  const textColorClass = showSolidBackground ? "text-chocolate" : "text-white";
  const logoToShow = showSolidBackground ? logo : logoWhite;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        showSolidBackground
          ? "bg-creamish backdrop-blur-xl border-b border-chocolate/10 shadow-lg py-3 md:py-4"
          : "bg-transparent py-2 md:py-3"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo - Responsive sizing */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <Link to={isAdminPage ? "/admin" : "/"}>
            <img
              src={logoToShow}
              alt="Blossom's Fitness Hub"
              className={`transition-all duration-300 ${
                showSolidBackground ? "h-8 md:h-10" : "h-10 md:h-12"
              } w-auto object-contain cursor-pointer`}
            />
          </Link>
          {isAdminPage && (
            <span className="hidden md:inline-block text-sm font-medium text-chocolate/70 ml-2">
              Admin Panel
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {(isAdminPage ? adminNavItems : navItems).map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`transition-colors duration-300 hover-underline font-medium ${
                showSolidBackground
                  ? "text-chocolate hover:text-[#8026d9]"
                  : "text-white hover:text-white/90"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Show cart only on non-admin pages */}
          {!isAdminPage && (
            <Button
              variant="ghost"
              size="icon"
              className={`relative hover:bg-[#8026d9]/20 ${textColorClass}`}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8026d9] text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-[#8026d9]/20 hidden md:inline-flex ${textColorClass}`}
                >
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() =>
                    navigate(user?.role === "admin" ? "/admin" : "/dashboard")
                  }
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isAdminPage && (
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-[#8026d9]/20 hidden md:inline-flex ${textColorClass}`}
                onClick={() => navigate("/login")}
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            )
          )}

          {/* Show Shop button only on non-admin pages */}
          {!isAdminPage && (
            <Button
              className="bg-[#8026d9] text-white hover:bg-[#8026d9]/90 hidden md:flex text-sm md:text-base"
              onClick={() => navigate("/shop")}
            >
              Shop
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden ${textColorClass}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Semi-transparent background */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed top-[60px] md:top-[68px] left-0 right-0 bottom-0 bg-black/80 backdrop-blur-md z-40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full overflow-y-auto">
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {(isAdminPage ? adminNavItems : navItems).map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-white hover:text-[#8026d9] transition-colors duration-300 font-medium py-3 text-lg border-b border-white/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Authentication Links */}
              {!isAdminPage && (
                <div className="pt-4 border-t border-white/30 mt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={user?.role === "admin" ? "/admin" : "/dashboard"}
                        className="text-white hover:text-[#8026d9] transition-colors duration-300 font-medium py-3 block text-lg border-b border-white/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="text-white hover:text-[#8026d9] transition-colors duration-300 font-medium py-3 block text-lg border-b border-white/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full text-red-400 border-red-400 hover:bg-red-400/20 mt-4 py-6 text-lg"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="text-white hover:text-[#8026d9] transition-colors duration-300 font-medium py-3 block text-lg border-b border-white/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}

              {/* Shop button only on non-admin pages */}
              {!isAdminPage && (
                <div className="pt-4 border-t border-white/30 mt-2 space-y-4">
                  <Button
                    className="bg-white text-[#8026d9] hover:bg-white/90 w-full py-6 text-lg font-medium"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/shop");
                    }}
                  >
                    Shop Now
                  </Button>

                  <Button
                    className="bg-[#8026d9] text-white hover:bg-[#8026d9]/90 w-full py-6 text-lg font-medium"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/contact");
                    }}
                  >
                    Contact Us
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
