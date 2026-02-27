import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, updateCartQuantity as updateCartQuantityAPI } from "../api/cartApi";

const GUEST_CART_KEY = "shopify_guest_cart";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(new Set());
  const { token, isAuthenticated } = useAuth();

  // Load guest cart when not authenticated; when user logs in, sync guest cart to server
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        } else {
          setCartItems([]);
        }
      } catch {
        setCartItems([]);
      }
    } else {
      // User is authenticated: sync guest cart to server if present, then clear guest storage
      let guestCart = [];
      try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          guestCart = Array.isArray(parsed) ? parsed : [];
        }
      } catch {}

      if (guestCart.length > 0 && token) {
        (async () => {
          const synced = [];
          for (const item of guestCart) {
            const result = await addToCartAPI(item.productId, item.quantity, token);
            if (result.success) {
              synced.push({ productId: item.productId, quantity: item.quantity });
            }
          }
          setCartItems(synced);
          try {
            localStorage.removeItem(GUEST_CART_KEY);
          } catch {}
        })();
      } else {
        try {
          localStorage.removeItem(GUEST_CART_KEY);
        } catch {}
        if (guestCart.length === 0) {
          setCartItems([]);
        }
      }
    }
  }, [isAuthenticated, token]);

  // Persist guest cart to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated && cartItems.length >= 0) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
      } catch {}
    }
  }, [isAuthenticated, cartItems]);

  // Calculate cart count from cart items
  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const addToCart = async (productId, quantity) => {
    // Guest: add to cart directly (local state + localStorage)
    if (!isAuthenticated || !token) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.productId === productId);
        let next;
        if (existingItem) {
          next = prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          next = [...prevItems, { productId, quantity }];
        }
        return next;
      });
      return { success: true, message: "Item added to cart" };
    }

    try {
      setLoadingProducts((prev) => new Set(prev).add(productId));
      const result = await addToCartAPI(productId, quantity, token);

      if (result.success) {
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
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
      return { success: true, message: "Item removed from cart" };
    }

    try {
      setLoadingProducts((prev) => new Set(prev).add(productId));
      const result = await removeFromCartAPI(productId, token);

      if (result.success) {
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
      if (quantity <= 0) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        return { success: true };
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
      return { success: true };
    }

    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      setLoadingProducts((prev) => new Set(prev).add(productId));
      const result = await updateCartQuantityAPI(productId, quantity, token);

      if (result.success) {
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