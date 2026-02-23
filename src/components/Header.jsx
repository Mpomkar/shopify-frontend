import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import { searchProducts } from "../api/productApi";
import AuthModal from "./AuthModal";
import "./Header.css";

function Header() {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { setSearchQuery, setSearchResults, setIsSearching: setGlobalIsSearching } = useSearch();

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = localSearchQuery.trim();
    
    if (!query) {
      // Clear search if empty
      setSearchQuery("");
      setSearchResults(null);
      setGlobalIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setGlobalIsSearching(true);
      setSearchQuery(query);
      
      const results = await searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setGlobalIsSearching(false);
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      // Show user menu or profile page
      console.log("User profile:", user);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo - Top Left */}
          <div className="logo">
            <a href="/" className="logo-link">
              <div className="logo-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span className="logo-text">ShopHub</span>
            </a>
          </div>

          {/* Search Bar - Center */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-wrapper">
                <svg
                  className="search-icon-left"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-button" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="header-actions">
            <button className="action-button cart-button" aria-label="Shopping Cart">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {isAuthenticated ? (
              <div className="user-menu">
                <button
                  className="action-button profile-button"
                  aria-label="Profile"
                  onClick={handleProfileClick}
                  title={user?.username || "User"}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user?.username || "User"}</div>
                    {user?.phoneNumber && (
                      <div className="user-email">{user.phoneNumber}</div>
                    )}
                    {user?.address && (
                      <div className="user-address">{user.address}</div>
                    )}
                  </div>
                  <button className="logout-btn" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="action-button login-button"
                onClick={() => setIsAuthModalOpen(true)}
                aria-label="Login"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span className="login-text">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

export default Header; 