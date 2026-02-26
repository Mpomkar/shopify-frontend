import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getSellerProducts, deleteSellerProduct } from "../api/sellerApi";
import ProductUploadForm from "./ProductUploadForm";
import EditProductForm from "./EditProductForm";
import "./SellerDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://react-frontend-9wcj.onrender.com";

function SellerDashboard() {
  const { seller, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getSellerProducts(token);
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchProducts(); // Refresh the product list
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    fetchProducts(); // Refresh the product list
  };

  const handleDeleteClick = (productId, productName) => {
    setDeleteConfirm({ productId, productName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    setError("");
    try {
      const response = await deleteSellerProduct(deleteConfirm.productId, token);
      // Handle both success response format and empty response (204)
      if (response && (response.success || response.status === 204)) {
        setDeleteConfirm(null);
        fetchProducts(); // Refresh the product list
      } else {
        setError(response?.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "An error occurred while deleting the product");
      // Keep the dialog open so user can see the error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Welcome, {seller?.username || "Seller"}!</p>
        </div>
        <button
          className="btn-upload"
          onClick={() => setShowUploadForm(true)}
        >
          + Upload New Product
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-overlay">
          <div className="upload-form-modal">
            <ProductUploadForm
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="upload-form-overlay">
          <div className="upload-form-modal">
            <EditProductForm
              product={editingProduct}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}

      {error && <div className="dashboard-error">{error}</div>}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="delete-confirm-overlay" onClick={handleDeleteCancel}>
          <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon">⚠️</div>
            <h3>Are you sure?</h3>
            <p>
              Do you want to delete <strong>"{deleteConfirm.productName}"</strong>?
            </p>
            <p className="delete-warning">
              This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button
                className="btn-cancel-delete"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No Products Yet</h2>
          <p>Start by uploading your first product!</p>
          <button
            className="btn-primary"
            onClick={() => setShowUploadForm(true)}
          >
            Upload Your First Product
          </button>
        </div>
      ) : (
        <>
          <div className="products-stats">
            <div className="stat-card">
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-card">
              <h3>
                {products.filter((p) => p.stockAvailability === "ready").length}
              </h3>
              <p>In Stock</p>
            </div>
            <div className="stat-card">
              <h3>
                {products.filter((p) => p.stockAvailability === "out_of_stock")
                  .length}
              </h3>
              <p>Out of Stock</p>
            </div>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.primaryImageUrl || product.imageUrl ? (
                    <img
                      src={getImageUrl(
                        product.primaryImageUrl || product.imageUrl
                      )}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div
                    className={`stock-badge ${
                      product.stockAvailability === "ready"
                        ? "in-stock"
                        : "out-of-stock"
                    }`}
                  >
                    {product.stockAvailability === "ready"
                      ? "In Stock"
                      : "Out of Stock"}
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-product-btn"
                      onClick={() => setEditingProduct(product)}
                      title="Edit Product / Replace Images"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="delete-product-btn"
                      onClick={() => handleDeleteClick(product.id, product.name)}
                      title="Delete Product"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  {product.brandName && (
                    <p className="product-brand">Brand: {product.brandName}</p>
                  )}
                  <div className="product-pricing">
                    {product.sellingPrice && (
                      <span className="selling-price">
                        ₹{product.sellingPrice.toLocaleString()}
                      </span>
                    )}
                    {product.mrp && product.mrp > product.sellingPrice && (
                      <span className="mrp">₹{product.mrp.toLocaleString()}</span>
                    )}
                    {product.discountPercent && (
                      <span className="discount">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  {product.availableQuantity !== undefined && (
                    <p className="quantity">
                      Available: {product.availableQuantity} units
                    </p>
                  )}
                  {product.skuId && (
                    <p className="sku">SKU: {product.skuId}</p>
                  )}
                  {product.uniqueProductId && (
                    <p className="unique-id">
                      ID: {product.uniqueProductId}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SellerDashboard;
