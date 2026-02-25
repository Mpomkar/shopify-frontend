import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, updateCartQuantity as updateCartQuantityAPI } from "../api/cartApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(new Set());
  const { token, isAuthenticated } = useAuth();

  // Calculate cart count from cart items
  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const addToCart = async (productId, quantity) => {
    if (!isAuthenticated || !token) {
      return { success: false, error: "Please login to add items to cart" };
    }

    try {
      setLoadingProducts((prev) => new Set(prev).add(productId));
      const result = await addToCartAPI(productId, quantity, token);
      
      if (result.success) {
        // Update local cart state
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.productId === productId);
          if (existingItem) {
            return prevItems.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            return [...prevItems, { productId, quantity }];
          }
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !token) {
      return { success: false, error: "Please login to remove items from cart" };
    }

    try {
      setLoadingProducts((prev) => new Set(prev).add(productId));
      const result = await removeFromCartAPI(productId, token);
      
      if (result.success) {
        // Update local cart state
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!isAuthenticated || !token) {
      return { success: false, error: "Please login to update cart" };
    }

    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      setLoadingProducts((prev) => new Set(prev).add(productId));
      const result = await updateCartQuantityAPI(productId, quantity, token);
      
      if (result.success) {
        // Update local cart state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isProductLoading = (productId) => {
    return loadingProducts.has(productId);
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  const value = {
    cartItems,
    cartCount,
    isLoading: loadingProducts.size > 0,
    isProductLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}