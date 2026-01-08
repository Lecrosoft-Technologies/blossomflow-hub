import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/axios";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
  profile_image?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          try {
            await api.get("/auth/user");
          } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to parse saved user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call Laravel API for signup
      const response = await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response.data.success) {
        const { user: userData, token, redirect_to, message } = response.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setUser(userData);

        // Show success message
        toast({
          title: "Account Created! 🎉",
          description: message || "Welcome to Blossom's Fitness Hub!",
        });

        // Redirect based on role
        if (redirect_to === "/admin") {
          navigate("/admin");
        } else {
          navigate(redirect_to || "/dashboard");
        }

        return true;
      } else {
        toast({
          title: "Signup Failed",
          description: response.data.message || "Failed to create account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: unknown) {
      // Handle API errors with proper typing
      let errorMessage = "Signup failed. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
            };
          };
        };

        // Handle Laravel validation errors
        if (axiosError.response?.data?.errors) {
          const errors = axiosError.response.data.errors;
          // Get first error message
          const firstErrorKey = Object.keys(errors)[0];
          const firstErrorMessage = errors[firstErrorKey]?.[0];
          errorMessage = firstErrorMessage || "Please check your input";
        } else if (axiosError.response?.data?.message) {
          // Server responded with error message
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === "object" && "request" in error) {
        // Request was made but no response
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call Laravel API
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user: userData, token, redirect_to } = response.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setUser(userData);

        // Show success message
        toast({
          title: "Welcome back!",
          description: `Logged in as ${userData.name}`,
        });

        // Redirect based on role
        if (redirect_to === "/admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

        return true;
      } else {
        toast({
          title: "Login Failed",
          description: response.data.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: unknown) {
      // Handle API errors with proper typing
      let errorMessage = "Login failed. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        // Server responded with error
        errorMessage =
          axiosError.response?.data?.message || "Invalid email or password";
      } else if (error && typeof error === "object" && "request" in error) {
        // Request was made but no response
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      const token = localStorage.getItem("token");
      if (token) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      // Show message and redirect
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });

      navigate("/");
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
