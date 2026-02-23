import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login({ onSwitchToSignup, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      onClose();
      setUsername("");
      setPassword("");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={onSwitchToSignup}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
