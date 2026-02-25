import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "./ProductCard.css";

function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { addToCart, updateCartQuantity, removeFromCart, getCartItemQuantity, isProductLoading } = useCart();
  const { isAuthenticated } = useAuth();

  // Get current cart quantity for this product
  const cartQuantity = getCartItemQuantity(product.id);

  // Sync local quantity with cart quantity if item exists in cart
  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [cartQuantity]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setMessage("");
      let result;
      
      // If item already exists in cart, update quantity instead of adding
      if (cartQuantity > 0) {
        result = await updateCartQuantity(product.id, quantity);
      } else {
        result = await addToCart(product.id, quantity);
      }
      
      if (result.success) {
        setMessage(cartQuantity > 0 ? "Cart updated!" : "Item added to cart!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.error || "Failed to update cart");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    // Buy now logic - can be implemented later
    console.log("Buy now:", {
      product: product.name,
      quantity: quantity,
      price: product.price,
    });
  };

  // Calculate discount (mock data - replace with actual data)
  const originalPrice = product.price * 1.2;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const rating = 4.5; // Mock rating
  const ratingCount = Math.floor(Math.random() * 500) + 50;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {discount > 0 && <div className="product-badge">{discount}% OFF</div>}
        <button className="wishlist-btn" aria-label="Add to wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <div className="product-image-wrapper">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="product-image"
          />
          {product.images.length > 1 && (
            <>
              <button
                className="image-nav-btn image-nav-prev"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                className="image-nav-btn image-nav-next"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="image-indicators">
            {product.images.map((_, index) => (
              <button
                key={index}
                className={`image-indicator ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-description">{product.description}</p>}
        
        <div className="product-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          </div>
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({ratingCount})</span>
        </div>

        <div className="product-price-container">
          <div className="product-price">${product.price.toFixed(2)}</div>
          {discount > 0 && (
            <>
              <div className="product-price-original">${originalPrice.toFixed(2)}</div>
              <div className="product-discount">{discount}% off</div>
            </>
          )}
        </div>

        <div className="product-actions">
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={handleDecreaseQuantity}
              aria-label="Decrease quantity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              className="quantity-btn"
              onClick={handleIncreaseQuantity}
              aria-label="Increase quantity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-add-cart" 
              onClick={handleAddToCart}
              disabled={isProductLoading(product.id)}
            >
              {isProductLoading(product.id) ? "Adding..." : cartQuantity > 0 ? "Update Cart" : "Add to Cart"}
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
          {message && (
            <div className={`cart-message ${message.includes("error") || message.includes("Failed") ? "error" : "success"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default ProductCard;
