import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = "https://react-frontend-9wcj.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Replace this with your actual API call when you have the login endpoint
      // const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, { ... });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock user data - replace with actual API response
      const userData = {
        id: 1,
        email: email,
        name: email.split("@")[0],
        token: "mock_token_" + Date.now(),
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
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
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
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