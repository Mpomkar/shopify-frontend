import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function AdminLogin({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const result = await adminLogin(username, password);
    setIsLoading(false);

    if (result.success) {
      onClose();
      setUsername("");
      setPassword("");
    } else {
      setError(result.error || "Admin login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Admin Login</h2>
        <p>Sign in to admin panel</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="admin-login-username">Username</label>
          <input
            id="admin-login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-login-password">Password</label>
          <input
            id="admin-login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In as Admin"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
