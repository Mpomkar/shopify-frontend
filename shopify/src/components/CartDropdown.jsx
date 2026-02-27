import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/productApi";
import "./CartDropdown.css";

function CartDropdown({ onClose, onLoginClick }) {
  const { cartItems, cartCount, isLoading, removeFromCart, updateCartQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allProducts = await getProducts();
        const cartProducts = cartItems.map((cartItem) => {
          const product = allProducts.find((p) => p.id === cartItem.productId);
          return product
            ? { ...product, cartQuantity: cartItem.quantity }
            : null;
        }).filter(Boolean);
        setProducts(cartProducts);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  const handleRemoveItem = async (productId) => {
    if (isAuthenticated) {
      await removeFromCart(productId);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    if (isAuthenticated) {
      await updateCartQuantity(productId, newQuantity);
    }
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + product.price * product.cartQuantity;
    }, 0);
  };

  if (!isAuthenticated && cartCount === 0) {
    return (
      <div className="cart-dropdown">
        <div className="cart-dropdown-header">
          <h3>My Cart</h3>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="cart-empty-state">
          <div className="empty-bag-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3>Your cart is empty</h3>
          <p>Add items from the store to get started</p>
          <div className="empty-cart-actions">
            <button className="btn-start-shopping" onClick={onClose}>Start Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-dropdown">
        <div className="cart-dropdown-header">
          <h3>My Cart</h3>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartCount === 0 || products.length === 0) {
    return (
      <div className="cart-dropdown">
        <div className="cart-dropdown-header">
          <h3>My Cart</h3>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="cart-empty-state">
          <div className="empty-bag-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3>Your cart is empty</h3>
          <p className="empty-cart-message">Add items from the store to get started</p>
          <div className="empty-cart-actions">
            <button className="btn-start-shopping" onClick={onClose}>Start Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-dropdown">
      <div className="cart-dropdown-header">
        <h3>My Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h3>
        <button className="cart-close-btn" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="cart-items-list">
        {products.map((product) => (
          <div key={product.id} className="cart-item">
            <div className="cart-item-image">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="cart-item-image-placeholder" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="cart-item-details">
              <h4 className="cart-item-name">{product.name}</h4>
              <div className="cart-item-price">${product.price.toFixed(2)}</div>
              <div className="cart-item-quantity-controls">
                <button
                  className="quantity-btn-minus"
                  onClick={() => handleQuantityChange(product.id, product.cartQuantity - 1)}
                  disabled={isLoading}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span className="quantity-value">{product.cartQuantity}</span>
                <button
                  className="quantity-btn-plus"
                  onClick={() => handleQuantityChange(product.id, product.cartQuantity + 1)}
                  disabled={isLoading}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            <button
              className="cart-item-remove"
              onClick={() => handleRemoveItem(product.id)}
              disabled={isLoading}
              aria-label="Remove item"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">${calculateTotal().toFixed(2)}</span>
        </div>
        <button
          className="btn-checkout"
          onClick={!isAuthenticated && onLoginClick ? () => { onClose(); onLoginClick(); } : undefined}
        >
          {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
        </button>
      </div>
    </div>
  );
}

export default CartDropdown;
