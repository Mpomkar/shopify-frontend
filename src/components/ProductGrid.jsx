import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../api/productApi";
import { useSearch } from "../context/SearchContext";
import "./ProductGrid.css";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, searchResults, isSearching } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch all products if not searching
    if (!searchQuery) {
      fetchProducts();
    }
  }, [searchQuery]);

  // Filter search results to only match product name (case-insensitive)
  const filteredSearchResults = useMemo(() => {
    if (searchResults === null || !searchQuery) {
      return null;
    }

    const query = searchQuery.toLowerCase().trim();
    return searchResults.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [searchResults, searchQuery]);

  // Use filtered search results if available, otherwise use all products
  const displayProducts = filteredSearchResults !== null ? filteredSearchResults : products;
  const displayLoading = loading || isSearching;
  const displayTitle = searchQuery ? `Search Results for "${searchQuery}"` : "Featured Products";
  const displaySubtitle = searchQuery
    ? `Found ${displayProducts.length} product${displayProducts.length !== 1 ? "s" : ""}`
    : "Discover our best-selling items";

  if (displayLoading) {
    return (
      <div className="product-grid-container">
        <div className="product-grid-header">
          <h2 className="section-title">{displayTitle}</h2>
          <p className="section-subtitle">{displaySubtitle}</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{searchQuery ? "Searching products..." : "Loading products..."}</p>
        </div>
      </div>
    );
  }

  if (error && !searchQuery) {
    return (
      <div className="product-grid-container">
        <div className="product-grid-header">
          <h2 className="section-title">{displayTitle}</h2>
          <p className="section-subtitle">{displaySubtitle}</p>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="product-grid-container">
        <div className="product-grid-header">
          <h2 className="section-title">{displayTitle}</h2>
          <p className="section-subtitle">{displaySubtitle}</p>
        </div>
        <div className="empty-container">
          <p>
            {searchQuery
              ? `No products found for "${searchQuery}". Try a different search term.`
              : "No products available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2 className="section-title">{displayTitle}</h2>
        <p className="section-subtitle">{displaySubtitle}</p>
      </div>
      <div className="product-grid">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;