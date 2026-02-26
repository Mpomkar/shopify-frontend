import { useState } from "react";
import { uploadProduct } from "../api/sellerApi";
import { useAuth } from "../context/AuthContext";
import "./ProductUploadForm.css";

function ProductUploadForm({ onSuccess, onCancel }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Required fields
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImages, setProductImages] = useState([]);

  // Optional pricing fields
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [gstIncluded, setGstIncluded] = useState("true");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState("1");

  // Optional product details
  const [brandName, setBrandName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");

  // Optional inventory
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [skuId, setSkuId] = useState("");
  const [stockAvailability, setStockAvailability] = useState("ready");

  // Optional specifications (JSON string)
  const [specifications, setSpecifications] = useState("");

  // Optional variants (JSON string)
  const [variants, setVariants] = useState("");

  // Optional shipping
  const [packageWeight, setPackageWeight] = useState("");
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("fulfilled");

  // Optional tax & compliance
  const [gstNumber, setGstNumber] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  // Optional legal
  const [brandAuthorized, setBrandAuthorized] = useState("true");
  const [trademarkVerified, setTrademarkVerified] = useState("true");
  const [complianceCertificates, setComplianceCertificates] = useState("");

  // Optional seller preferences
  const [returnPolicy, setReturnPolicy] = useState("");
  const [replacementAvailable, setReplacementAvailable] = useState("true");
  const [warrantyDetails, setWarrantyDetails] = useState("");

  // Optional image types
  const [imageTypes, setImageTypes] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!productName || !productDescription || !productCategory) {
      setError("Please fill in all required fields (Product Name, Description, Category)");
      return;
    }

    if (productImages.length === 0) {
      setError("Please upload at least one product image");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Required fields
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("productCategory", productCategory);

      // Product images (multiple)
      productImages.forEach((image) => {
        formData.append("productImages[]", image);
      });

      // Optional pricing
      if (mrp) formData.append("mrp", mrp);
      if (sellingPrice) {
        formData.append("sellingPrice", sellingPrice);
        formData.append("productPrice", sellingPrice); // Legacy field
      }
      if (discountPercent) formData.append("discountPercent", discountPercent);
      if (gstIncluded) formData.append("gstIncluded", gstIncluded);
      if (minimumOrderQuantity) formData.append("minimumOrderQuantity", minimumOrderQuantity);

      // Optional product details
      if (brandName) formData.append("brandName", brandName);
      if (subCategory) formData.append("subCategory", subCategory);
      if (longDescription) formData.append("longDescription", longDescription);
      if (keyFeatures) formData.append("keyFeatures", keyFeatures);

      // Optional inventory
      if (availableQuantity) formData.append("availableQuantity", availableQuantity);
      if (skuId) formData.append("skuId", skuId);
      if (stockAvailability) formData.append("stockAvailability", stockAvailability);

      // Optional specifications (validate JSON)
      if (specifications) {
        try {
          JSON.parse(specifications);
          formData.append("specifications", specifications);
        } catch (e) {
          setError("Specifications must be valid JSON format");
          setIsLoading(false);
          return;
        }
      }

      // Optional variants (validate JSON)
      if (variants) {
        try {
          JSON.parse(variants);
          formData.append("variants", variants);
        } catch (e) {
          setError("Variants must be valid JSON format");
          setIsLoading(false);
          return;
        }
      }

      // Optional shipping
      if (packageWeight) formData.append("packageWeight", packageWeight);
      if (packageLength) formData.append("packageLength", packageLength);
      if (packageWidth) formData.append("packageWidth", packageWidth);
      if (packageHeight) formData.append("packageHeight", packageHeight);
      if (pickupAddress) formData.append("pickupAddress", pickupAddress);
      if (deliveryMethod) formData.append("deliveryMethod", deliveryMethod);

      // Optional tax & compliance
      if (gstNumber) formData.append("gstNumber", gstNumber);
      if (hsnCode) formData.append("hsnCode", hsnCode);

      // Optional legal
      if (brandAuthorized) formData.append("brandAuthorized", brandAuthorized);
      if (trademarkVerified) formData.append("trademarkVerified", trademarkVerified);
      if (complianceCertificates) {
        try {
          JSON.parse(complianceCertificates);
          formData.append("complianceCertificates", complianceCertificates);
        } catch (e) {
          formData.append("complianceCertificates", `["${complianceCertificates}"]`);
        }
      }

      // Optional seller preferences
      if (returnPolicy) formData.append("returnPolicy", returnPolicy);
      if (replacementAvailable) formData.append("replacementAvailable", replacementAvailable);
      if (warrantyDetails) formData.append("warrantyDetails", warrantyDetails);

      // Optional image types
      if (imageTypes) {
        try {
          JSON.parse(imageTypes);
          formData.append("imageTypes", imageTypes);
        } catch (e) {
          formData.append("imageTypes", `["${imageTypes}"]`);
        }
      }

      const result = await uploadProduct(formData, token);

      if (result.success) {
        setSuccess("Product uploaded successfully!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          // Reset form
          resetForm();
        }, 1500);
      } else {
        setError(result.message || "Failed to upload product");
      }
    } catch (err) {
      setError(err.message || "An error occurred while uploading the product");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setProductImages([]);
    setMrp("");
    setSellingPrice("");
    setDiscountPercent("");
    setGstIncluded("true");
    setMinimumOrderQuantity("1");
    setBrandName("");
    setSubCategory("");
    setLongDescription("");
    setKeyFeatures("");
    setAvailableQuantity("");
    setSkuId("");
    setStockAvailability("ready");
    setSpecifications("");
    setVariants("");
    setPackageWeight("");
    setPackageLength("");
    setPackageWidth("");
    setPackageHeight("");
    setPickupAddress("");
    setDeliveryMethod("fulfilled");
    setGstNumber("");
    setHsnCode("");
    setBrandAuthorized("true");
    setTrademarkVerified("true");
    setComplianceCertificates("");
    setReturnPolicy("");
    setReplacementAvailable("true");
    setWarrantyDetails("");
    setImageTypes("");
  };

  return (
    <div className="product-upload-form-container">
      <div className="product-upload-form-header">
        <h2>Upload New Product</h2>
        {onCancel && (
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <form onSubmit={handleSubmit} className="product-upload-form">
        {/* Required Fields Section */}
        <div className="form-section">
          <h3>Required Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                placeholder="e.g., Dell Laptop XPS 15"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                required
                placeholder="e.g., Electronics"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Product Description *</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
              placeholder="Brief description of the product"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Product Images * (at least one)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            {productImages.length > 0 && (
              <div className="image-preview">
                {productImages.map((img, idx) => (
                  <span key={idx} className="image-name">
                    {img.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="form-section">
          <h3>Pricing</h3>
          <div className="form-row">
            <div className="form-group">
              <label>MRP</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="60000"
              />
            </div>
            <div className="form-group">
              <label>Selling Price</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="55000"
              />
            </div>
            <div className="form-group">
              <label>Discount %</label>
              <input
                type="number"
                step="0.01"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="8.33"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GST Included</label>
              <select
                value={gstIncluded}
                onChange={(e) => setGstIncluded(e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Minimum Order Quantity</label>
              <input
                type="number"
                value={minimumOrderQuantity}
                onChange={(e) => setMinimumOrderQuantity(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="form-section">
          <h3>Product Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Dell"
              />
            </div>
            <div className="form-group">
              <label>Sub Category</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g., Laptops"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Long Description</label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Full product description..."
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Key Features</label>
            <textarea
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              placeholder="e.g., 16GB RAM, 512GB SSD, Intel i7"
              rows="3"
            />
          </div>
        </div>

        {/* Inventory Section */}
        <div className="form-section">
          <h3>Inventory</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Available Quantity</label>
              <input
                type="number"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                placeholder="50"
              />
            </div>
            <div className="form-group">
              <label>SKU ID</label>
              <input
                type="text"
                value={skuId}
                onChange={(e) => setSkuId(e.target.value)}
                placeholder="DELL-XPS15-001"
              />
            </div>
            <div className="form-group">
              <label>Stock Availability</label>
              <select
                value={stockAvailability}
                onChange={(e) => setStockAvailability(e.target.value)}
              >
                <option value="ready">Ready</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="pre_order">Pre-order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specifications & Variants Section */}
        <div className="form-section">
          <h3>Specifications & Variants</h3>
          <div className="form-group">
            <label>Specifications (JSON format)</label>
            <textarea
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder='{"Model Number":"XPS 15","RAM":"16GB","Storage":"512GB SSD"}'
              rows="4"
            />
            <small>Enter as JSON object</small>
          </div>
          <div className="form-group">
            <label>Variants (JSON format)</label>
            <textarea
              value={variants}
              onChange={(e) => setVariants(e.target.value)}
              placeholder='[{"type":"color","value":"Black","priceModifier":0}]'
              rows="4"
            />
            <small>Enter as JSON array</small>
          </div>
        </div>

        {/* Shipping Section */}
        <div className="form-section">
          <h3>Shipping Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Package Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={packageWeight}
                onChange={(e) => setPackageWeight(e.target.value)}
                placeholder="2.5"
              />
            </div>
            <div className="form-group">
              <label>Length (cm)</label>
              <input
                type="number"
                value={packageLength}
                onChange={(e) => setPackageLength(e.target.value)}
                placeholder="35"
              />
            </div>
            <div className="form-group">
              <label>Width (cm)</label>
              <input
                type="number"
                value={packageWidth}
                onChange={(e) => setPackageWidth(e.target.value)}
                placeholder="25"
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                value={packageHeight}
                onChange={(e) => setPackageHeight(e.target.value)}
                placeholder="3"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pickup Address</label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Warehouse A, Mumbai"
              />
            </div>
            <div className="form-group">
              <label>Delivery Method</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option value="fulfilled">Fulfilled</option>
                <option value="self">Self</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tax & Compliance Section */}
        <div className="form-section">
          <h3>Tax & Compliance</h3>
          <div className="form-row">
            <div className="form-group">
              <label>GST Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="27ABCDE1234F1Z5"
              />
            </div>
            <div className="form-group">
              <label>HSN Code</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                placeholder="8471"
              />
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="form-section">
          <h3>Legal & Compliance</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Brand Authorized</label>
              <select
                value={brandAuthorized}
                onChange={(e) => setBrandAuthorized(e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trademark Verified</label>
              <select
                value={trademarkVerified}
                onChange={(e) => setTrademarkVerified(e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Compliance Certificates (JSON array or comma-separated)</label>
            <input
              type="text"
              value={complianceCertificates}
              onChange={(e) => setComplianceCertificates(e.target.value)}
              placeholder='["BIS","CE"] or BIS, CE'
            />
          </div>
        </div>

        {/* Seller Preferences Section */}
        <div className="form-section">
          <h3>Seller Preferences</h3>
          <div className="form-group">
            <label>Return Policy</label>
            <textarea
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              placeholder="7 days return, 10 days replacement"
              rows="2"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Replacement Available</label>
              <select
                value={replacementAvailable}
                onChange={(e) => setReplacementAvailable(e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Warranty Details</label>
              <input
                type="text"
                value={warrantyDetails}
                onChange={(e) => setWarrantyDetails(e.target.value)}
                placeholder="1 year manufacturer warranty"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductUploadForm;
