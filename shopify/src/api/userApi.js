import client from "./client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://react-frontend-9wcj.onrender.com";

export const getUsers = async () => {
  const res = await client.get("/api/users");
  return res.data;
};

export const getUserProfile = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    const url = `${API_BASE_URL}/api/v1/user/profile`;
    console.log("Fetching user profile from:", url);
    
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

    const profileData = await response.json();
    console.log("User profile response:", profileData);
    return profileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Provide more helpful error message for network errors
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error(`Network error: Unable to connect to ${API_BASE_URL}. Please check if the server is running and CORS is configured.`);
    }
    throw error;
  }
};

export const updateUserProfile = async (formData, token) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API URL is not configured. Please check your environment variables.");
    }
    
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    
    const url = `${API_BASE_URL}/api/v1/user/profile`;
    console.log("Updating user profile - API URL:", url);
    console.log("Token present:", !!token);
    console.log("FormData entries:", Array.from(formData.entries()));
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
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

    const updateResponse = await response.json();
    console.log("Update success - Response:", updateResponse);
    return updateResponse;
  } catch (error) {
    console.error("Error updating user profile:", error);
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
