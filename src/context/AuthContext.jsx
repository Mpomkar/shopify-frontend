import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = "https://react-frontend-9wcj.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Store token and user data from API response
        const authToken = data.data.token;
        const userData = {
          id: data.data.user.id,
          username: data.data.user.username,
          phoneNumber: data.data.user.phoneNumber,
          alternateNumber: data.data.user.alternateNumber,
          address: data.data.user.address,
          photoBase64: data.data.user.photoBase64,
        };

        setUser(userData);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
        
        return { success: true, user: userData, token: authToken };
      } else {
        return {
          success: false,
          error: data.message || "Login failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please try again.",
      };
    }
  };

  const signup = async (username, password, phoneNumber, address) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          phoneNumber: phoneNumber,
          address: address,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Store user data from API response
        const userData = {
          id: data.data.id,
          username: data.data.username,
          phoneNumber: data.data.phoneNumber,
          address: data.data.address,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: data.message || "Signup failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
