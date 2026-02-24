import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import SellerLogin from "./SellerLogin";
import SellerSignup from "./SellerSignup";
import "./Auth.css";

function AuthModal({ isOpen, onClose, defaultType = "user" }) {
  const [authType, setAuthType] = useState(defaultType); // 'user', 'seller', 'admin'
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const handleTypeSwitch = (type) => {
    setAuthType(type);
    setIsLogin(true);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Auth Type Selector */}
        <div className="auth-type-selector">
          <button
            className={`auth-type-btn ${authType === "user" ? "active" : ""}`}
            onClick={() => handleTypeSwitch("user")}
          >
            User
          </button>
          <button
            className={`auth-type-btn ${authType === "seller" ? "active" : ""}`}
            onClick={() => handleTypeSwitch("seller")}
          >
            Seller
          </button>
        </div>

        {/* Render appropriate component based on auth type */}
        {authType === "user" && (
          <>
            {isLogin ? (
              <Login
                onSwitchToSignup={() => setIsLogin(false)}
                onClose={onClose}
              />
            ) : (
              <Signup
                onSwitchToLogin={() => setIsLogin(true)}
                onClose={onClose}
              />
            )}
          </>
        )}

        {authType === "seller" && (
          <>
            {isLogin ? (
              <SellerLogin
                onSwitchToSignup={() => setIsLogin(false)}
                onClose={onClose}
              />
            ) : (
              <SellerSignup
                onSwitchToLogin={() => setIsLogin(true)}
                onClose={onClose}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
