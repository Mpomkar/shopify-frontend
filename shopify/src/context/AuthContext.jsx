import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = "https://react-frontend-9wcj.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); // 'user', 'seller', 'admin'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user/seller/admin is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    const savedSeller = localStorage.getItem("seller");
    const savedAdmin = localStorage.getItem("admin");
    const savedToken = localStorage.getItem("token");
    const savedUserType = localStorage.getItem("userType");
    
    if (savedToken) {
      try {
        if (savedUserType === "user" && savedUser) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          setUserType("user");
        } else if (savedUserType === "seller" && savedSeller) {
          setSeller(JSON.parse(savedSeller));
          setToken(savedToken);
          setUserType("seller");
        } else if (savedUserType === "admin" && savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));
          setToken(savedToken);
          setUserType("admin");
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.clear();
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

  const signup = async (username, email, password, phoneNumber, address) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
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
          email: data.data.email || email || "", // Use API response or fallback to provided email
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

  // Seller Login
  const sellerLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/seller/login`, {
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
        const authToken = data.data.token;
        const sellerData = {
          id: data.data.seller.id,
          username: data.data.seller.username,
          email: data.data.seller.email,
          whatsappNumber: data.data.seller.whatsappNumber,
          businessEmail: data.data.seller.businessEmail,
          gstNumber: data.data.seller.gstNumber,
          photoBase64: data.data.seller.photoBase64,
        };

        setSeller(sellerData);
        setToken(authToken);
        setUserType("seller");
        localStorage.setItem("seller", JSON.stringify(sellerData));
        localStorage.setItem("token", authToken);
        localStorage.setItem("userType", "seller");
        
        return { success: true, seller: sellerData, token: authToken };
      } else {
        return {
          success: false,
          error: data.message || "Seller login failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Seller login error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please try again.",
      };
    }
  };

  // Seller Signup
  const sellerSignup = async (username, password, email, whatsappNumber, businessEmail, gstNumber, photoBase64) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/seller/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          whatsappNumber: whatsappNumber,
          businessEmail: businessEmail,
          gstNumber: gstNumber,
          photoBase64: photoBase64 || "",
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const sellerData = {
          id: data.data.id,
          username: data.data.username,
          email: data.data.email,
          whatsappNumber: data.data.whatsappNumber,
          businessEmail: data.data.businessEmail,
          gstNumber: data.data.gstNumber,
        };

        setSeller(sellerData);
        localStorage.setItem("seller", JSON.stringify(sellerData));
        return { success: true, seller: sellerData };
      } else {
        return {
          success: false,
          error: data.message || "Seller signup failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Seller signup error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please try again.",
      };
    }
  };

  // Admin Login
  const adminLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
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
        const authToken = data.data.token;
        const adminData = {
          username: data.data.username,
          roles: data.data.roles || [],
        };

        setAdmin(adminData);
        setToken(authToken);
        setUserType("admin");
        localStorage.setItem("admin", JSON.stringify(adminData));
        localStorage.setItem("token", authToken);
        localStorage.setItem("userType", "admin");
        
        return { success: true, admin: adminData, token: authToken };
      } else {
        return {
          success: false,
          error: data.message || "Admin login failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setSeller(null);
    setAdmin(null);
    setToken(null);
    setUserType(null);
    localStorage.removeItem("user");
    localStorage.removeItem("seller");
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  const value = {
    user,
    seller,
    admin,
    token,
    userType,
    login,
    signup,
    sellerLogin,
    sellerSignup,
    adminLogin,
    logout,
    isLoading,
    isAuthenticated: !!(user || seller || admin) && !!token,
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
