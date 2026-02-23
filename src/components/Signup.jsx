import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Signup({ onSwitchToLogin, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !password || !confirmPassword || !phoneNumber || !address) {
      setError("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (address.length < 5) {
      setError("Please enter a valid address");
      return;
    }

    setIsLoading(true);
    const result = await signup(username, password, phoneNumber, address);
    setIsLoading(false);

    if (result.success) {
      onClose();
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setPhoneNumber("");
      setAddress("");
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-phone">Phone Number</label>
          <input
            id="signup-phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number (10 digits)"
            disabled={isLoading}
            required
            maxLength="10"
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-address">Address</label>
          <input
            id="signup-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" required />
            <span>I agree to the Terms and Conditions</span>
          </label>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={onSwitchToLogin}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;