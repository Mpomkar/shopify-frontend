const API_BASE_URL = import.meta.env.VITE_API_URL || "https://react-frontend-9wcj.onrender.com";

export const getSellerProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/seller/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Seller profile response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    throw error;
  }
};

export const updateSellerProfile = async (formData, token) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API URL is not configured. Please check your environment variables.");
    }
    
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    
    const url = `${API_BASE_URL}/api/v1/seller/profile`;
    console.log("Updating seller profile - API URL:", url);
    console.log("Token present:", !!token);
    console.log("FormData entries:", Array.from(formData.entries()));
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      },
      body: formData,
      // Add credentials for CORS if needed
      credentials: "include",
    });

    console.log("Update response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed - Response:", errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Update success - Response:", data);
    return data;
  } catch (error) {
    console.error("Error updating seller profile:", error);
    // Provide more helpful error message based on error type
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      if (API_BASE_URL.includes("localhost")) {
        throw new Error(`Connection refused: Backend server is not running at ${API_BASE_URL}. Please:\n1. Start your Spring Boot backend server\n2. Or update .env.development to use the deployed backend: https://react-frontend-9wcj.onrender.com`);
      } else {
        throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Please check:\n1. Your internet connection\n2. The backend server is running\n3. CORS is properly configured`);
      }
    }
    throw error;
  }
};

// Upload Product
export const uploadProduct = async (formData, token) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API URL is not configured. Please check your environment variables.");
    }
    
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    
    const url = `${API_BASE_URL}/api/v1/seller/products`;
    console.log("Uploading product - API URL:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
      credentials: "include",
    });

    console.log("Upload response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed - Response:", errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload success - Response:", data);
    return data;
  } catch (error) {
    console.error("Error uploading product:", error);
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      if (API_BASE_URL.includes("localhost")) {
        throw new Error(`Connection refused: Backend server is not running at ${API_BASE_URL}.`);
      } else {
        throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Please check your connection and CORS configuration.`);
      }
    }
    throw error;
  }
};

// Get Seller Products
export const getSellerProducts = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    const url = `${API_BASE_URL}/api/v1/seller/products`;
    console.log("Fetching seller products from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Seller products response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching seller products:", error);
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Please check if the server is running and CORS is configured.`);
    }
    throw error;
  }
};

// Update Seller Product
export const updateSellerProduct = async (productId, formData, token) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API URL is not configured. Please check your environment variables.");
    }
    
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    
    if (!productId) {
      throw new Error("Product ID is required.");
    }
    
    const url = `${API_BASE_URL}/api/v1/seller/products/${productId}`;
    console.log("Updating product - API URL:", url);
    console.log("Product ID:", productId);
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
      credentials: "include",
    });

    console.log("Update response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed - Response:", errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Update success - Response:", data);
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      if (API_BASE_URL.includes("localhost")) {
        throw new Error(`Connection refused: Backend server is not running at ${API_BASE_URL}.`);
      } else {
        throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Please check your connection and CORS configuration.`);
      }
    }
    throw error;
  }
};

// Delete Seller Product
export const deleteSellerProduct = async (productId, token) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API URL is not configured. Please check your environment variables.");
    }
    
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    
    if (!productId) {
      throw new Error("Product ID is required.");
    }
    
    const url = `${API_BASE_URL}/api/v1/seller/products/${productId}`;
    console.log("Deleting product - API URL:", url);
    console.log("Product ID:", productId);
    console.log("Token present:", !!token);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("Delete response status:", response.status, response.statusText);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.error("Delete failed - Response text:", errorText);
      } catch (e) {
        console.error("Could not read error response");
      }
      
      let errorData;
      try {
        if (errorText) {
          errorData = JSON.parse(errorText);
        } else {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
      } catch (e) {
        errorData = { 
          message: errorText || `HTTP error! status: ${response.status}. ${response.status === 403 ? 'Access forbidden. Please check if the product belongs to you and CORS is configured.' : ''}` 
        };
      }
      
      // Provide more specific error message for 403
      if (response.status === 403) {
        throw new Error(`Access forbidden (403): ${errorData.message || 'You may not have permission to delete this product, or CORS is not configured properly on the backend.'}`);
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle empty response (204 No Content)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { success: true, message: "Product deleted successfully" };
    }

    const data = await response.json();
    console.log("Delete success - Response:", data);
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      if (API_BASE_URL.includes("localhost")) {
        throw new Error(`Connection refused: Backend server is not running at ${API_BASE_URL}.`);
      } else {
        throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Please check your connection and CORS configuration.`);
      }
    }
    throw error;
  }
};
