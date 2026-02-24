const API_BASE_URL = "https://react-frontend-9wcj.onrender.com";

export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/cart/add/${productId}?quantity=${quantity}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true, message: data.message || "Item added to cart" };
    } else {
      return { success: false, error: data.message || "Failed to add item to cart" };
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: error.message || "Network error" };
  }
};

export const removeFromCart = async (productId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/cart/remove/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true, message: data.message || "Item removed from cart" };
    } else {
      return { success: false, error: data.message || "Failed to remove item from cart" };
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: error.message || "Network error" };
  }
};

export const updateCartQuantity = async (productId, quantity, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/cart/update/${productId}?quantity=${quantity}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true, message: data.message || "Cart updated successfully" };
    } else {
      return { success: false, error: data.message || "Failed to update cart" };
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, error: error.message || "Network error" };
  }
};