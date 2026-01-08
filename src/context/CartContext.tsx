import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: { usd: number; naira: number; gbp: number };
  image: string;
  category: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  currency: "usd" | "naira" | "gbp";
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CURRENCY"; payload: "usd" | "naira" | "gbp" }
  | { type: "TOGGLE_CART" };

const initialState: CartState = {
  items: [],
  currency: "usd",
  isOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
      };
    }

    case "SET_CURRENCY": {
      return {
        ...state,
        currency: action.payload,
      };
    }

    case "TOGGLE_CART": {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: "usd" | "naira" | "gbp") => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  formatPrice: (price: { usd: number; naira: number; gbp: number }) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load cart from localStorage
  const loadCartFromStorage = (): CartState => {
    try {
      const savedCart = localStorage.getItem("blossomCart");
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    loadCartFromStorage
  );
  const { toast } = useToast();

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("blossomCart", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }, [state]);

  const addItem = (product: Product) => {
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: "ADD_ITEM", payload: product });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const setCurrency = (currency: "usd" | "naira" | "gbp") => {
    dispatch({ type: "SET_CURRENCY", payload: currency });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + item.price[state.currency] * item.quantity;
    }, 0);
  };

  const formatPrice = (price: { usd: number; naira: number; gbp: number }) => {
    const symbols = { usd: "$", naira: "₦", gbp: "£" };
    const amount = price[state.currency];

    // Use Intl.NumberFormat for comma-separated formatting
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${symbols[state.currency]}${formattedAmount}`;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCurrency,
    toggleCart,
    getTotalItems,
    getTotalPrice,
    formatPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
