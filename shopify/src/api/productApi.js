const API_BASE_URL = "https://react-frontend-9wcj.onrender.com";

const transformProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  category: product.category,
  uniqueProductId: product.uniqueProductId,
  images: product.imageUrl
    ? [
        product.imageUrl.startsWith("http")
          ? product.imageUrl
          : `${API_BASE_URL}${product.imageUrl}`,
      ]
    : ["https://via.placeholder.com/400x400?text=No+Image"],
});

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map(transformProduct);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/products/search?query=${encodeURIComponent(query.trim())}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map(transformProduct);
    }
    
    return [];
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};