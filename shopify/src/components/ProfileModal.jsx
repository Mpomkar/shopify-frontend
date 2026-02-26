import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import { getSellerProfile, updateSellerProfile } from "../api/sellerApi";
import "./ProfileModal.css";

function ProfileModal({ isOpen, onClose }) {
  const { user, seller, userType, token, updateUser, updateSeller } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    alternateNumber: "",
    address: "",
    whatsappNumber: "",
    businessEmail: "",
    gstNumber: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Get profile data from context or API
  useEffect(() => {
    if (!isOpen) {
      setProfileData(null);
      setError("");
      setSuccess("");
      setIsLoading(false);
      setIsEditMode(false);
      setPhotoPreview(null);
      return;
    }

    // First, set data from context immediately
    if (userType === "user" && user) {
      setProfileData(user);
      setFormData({
        alternateNumber: user.alternateNumber || "",
        address: user.address || "",
        whatsappNumber: "",
        businessEmail: "",
        gstNumber: "",
        photo: null,
      });
    } else if (userType === "seller" && seller) {
      setProfileData(seller);
      setFormData({
        alternateNumber: "",
        address: "",
        whatsappNumber: seller.whatsappNumber || "",
        businessEmail: seller.businessEmail || "",
        gstNumber: seller.gstNumber || "",
        photo: null,
      });
    }

    // Then try to fetch fresh data from API
    if (token && (userType === "user" || userType === "seller")) {
      setIsLoading(true);
      const fetchProfile = async () => {
        try {
          let response;
          if (userType === "user") {
            response = await getUserProfile(token);
          } else {
            response = await getSellerProfile(token);
          }

          if (response && response.success && response.data) {
            setProfileData(response.data);
            // Update form data with fetched data
            if (userType === "user") {
              setFormData({
                alternateNumber: response.data.alternateNumber || "",
                address: response.data.address || "",
                whatsappNumber: "",
                businessEmail: "",
                gstNumber: "",
                photo: null,
              });
            } else {
              setFormData({
                alternateNumber: "",
                address: "",
                whatsappNumber: response.data.whatsappNumber || "",
                businessEmail: response.data.businessEmail || "",
                gstNumber: response.data.gstNumber || "",
                photo: null,
              });
            }
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isOpen, userType, user, seller, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const retryFetch = async () => {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      let response;
      if (userType === "user") {
        response = await getUserProfile(token);
      } else {
        response = await getSellerProfile(token);
      }
      if (response && response.success && response.data) {
        setProfileData(response.data);
        if (userType === "user") {
          setFormData({
            alternateNumber: response.data.alternateNumber || "",
            address: response.data.address || "",
            whatsappNumber: "",
            businessEmail: "",
            gstNumber: "",
            photo: null,
          });
        } else {
          setFormData({
            alternateNumber: "",
            address: "",
            whatsappNumber: response.data.whatsappNumber || "",
            businessEmail: response.data.businessEmail || "",
            gstNumber: response.data.gstNumber || "",
            photo: null,
          });
        }
      }
    } catch (err) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      setError("No authentication token found. Please login again.");
      return;
    }

    // Validate that we have at least one field to update
    const hasChanges = 
      (userType === "user" && (formData.alternateNumber || formData.address || formData.photo)) ||
      (userType === "seller" && (formData.whatsappNumber || formData.businessEmail || formData.gstNumber || formData.photo));
    
    if (!hasChanges) {
      setError("Please make at least one change before saving.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");
    
    console.log("Saving profile - UserType:", userType, "Token:", token ? token.substring(0, 20) + "..." : "No token");

    try {
      const formDataToSend = new FormData();
      
      if (userType === "user") {
        if (formData.alternateNumber) {
          formDataToSend.append("alternateNumber", formData.alternateNumber);
        }
        if (formData.address) {
          formDataToSend.append("address", formData.address);
        }
        if (formData.photo) {
          formDataToSend.append("photo", formData.photo);
        }
      } else if (userType === "seller") {
        if (formData.whatsappNumber) {
          formDataToSend.append("whatsappNumber", formData.whatsappNumber);
        }
        if (formData.businessEmail) {
          formDataToSend.append("businessEmail", formData.businessEmail);
        }
        if (formData.gstNumber) {
          formDataToSend.append("gstNumber", formData.gstNumber);
        }
        if (formData.photo) {
          formDataToSend.append("photo", formData.photo);
        }
      }

      let response;
      if (userType === "user") {
        response = await updateUserProfile(formDataToSend, token);
      } else {
        response = await updateSellerProfile(formDataToSend, token);
      }

      if (response && response.success && response.data) {
        setSuccess("Profile updated successfully!");
        
        // Refetch profile to get updated photoBase64
        try {
          let freshResponse;
          if (userType === "user") {
            freshResponse = await getUserProfile(token);
          } else {
            freshResponse = await getSellerProfile(token);
          }
          
          if (freshResponse && freshResponse.success && freshResponse.data) {
            // Update profile data with fresh data from API (includes updated photo)
            setProfileData(freshResponse.data);
            
            // Update form data
            if (userType === "user") {
              setFormData({
                alternateNumber: freshResponse.data.alternateNumber || "",
                address: freshResponse.data.address || "",
                whatsappNumber: "",
                businessEmail: "",
                gstNumber: "",
                photo: null,
              });
            } else {
              setFormData({
                alternateNumber: "",
                address: "",
                whatsappNumber: freshResponse.data.whatsappNumber || "",
                businessEmail: freshResponse.data.businessEmail || "",
                gstNumber: freshResponse.data.gstNumber || "",
                photo: null,
              });
            }
            
            // Update context with new data
            if (userType === "user" && updateUser) {
              updateUser(freshResponse.data);
            } else if (userType === "seller" && updateSeller) {
              updateSeller(freshResponse.data);
            }
          } else {
            // Fallback to response data if refetch fails
            setProfileData(response.data);
            if (userType === "user" && updateUser) {
              updateUser(response.data);
            } else if (userType === "seller" && updateSeller) {
              updateSeller(response.data);
            }
          }
        } catch (refetchError) {
          console.error("Error refetching profile:", refetchError);
          // Still update with response data
          setProfileData(response.data);
          if (userType === "user" && updateUser) {
            updateUser(response.data);
          } else if (userType === "seller" && updateSeller) {
            updateSeller(response.data);
          }
        }
        
        // Clear photo preview since we now have the new image from API
        setPhotoPreview(null);
        // Clear photo from form data
        setFormData((prev) => ({ ...prev, photo: null }));
        setIsEditMode(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to connect to server. Please check:\n1. Your internet connection\n2. The API server is running\n3. CORS is properly configured";
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="profile-modal-header">
          <h2>Profile Information</h2>
          {!isEditMode && profileData && (
            <button className="edit-profile-btn" onClick={() => setIsEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-modal-content">
          {isLoading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading profile...</p>
            </div>
          ) : error ? (
            <div className="profile-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>{error}</p>
              <button className="retry-btn" onClick={retryFetch}>
                Retry
              </button>
            </div>
          ) : profileData ? (
            <div className="profile-details">
              {/* Success Message */}
              {success && (
                <div className="profile-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {/* Profile Photo */}
              <div className="profile-photo-section">
                <div className="profile-photo-container">
                  {photoPreview ? (
                    // Show preview of newly selected image
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="profile-photo"
                    />
                  ) : profileData.photoBase64 ? (
                    // Show existing profile image from API
                    <img
                      src={`data:image/jpeg;base64,${profileData.photoBase64}`}
                      alt="Profile"
                      className="profile-photo"
                      onError={(e) => {
                        console.error("Error loading profile image");
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    // Show placeholder if no image
                    <div className="profile-photo-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="profile-photo-upload">
                    <label htmlFor="photo-upload" className="photo-upload-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      {formData.photo ? formData.photo.name : "Change Photo"}
                    </label>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: "none" }}
                    />
                    {formData.photo && (
                      <button
                        className="remove-photo-btn"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, photo: null }));
                          setPhotoPreview(null);
                          document.getElementById("photo-upload").value = "";
                        }}
                        type="button"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile Fields */}
              {userType === "user" && (
                <div className="profile-fields">
                  <div className="profile-field">
                    <label>Username</label>
                    <div className="profile-value">{profileData.username || "N/A"}</div>
                  </div>
                  <div className="profile-field">
                    <label>Phone Number</label>
                    <div className="profile-value">{profileData.phoneNumber || "N/A"}</div>
                  </div>
                  {isEditMode ? (
                    <>
                      <div className="profile-field">
                        <label>Alternate Number</label>
                        <input
                          type="text"
                          name="alternateNumber"
                          value={formData.alternateNumber}
                          onChange={handleInputChange}
                          className="profile-input"
                          placeholder="Enter alternate number"
                        />
                      </div>
                      <div className="profile-field">
                        <label>Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="profile-textarea"
                          placeholder="Enter address"
                          rows="3"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profileData.alternateNumber && (
                        <div className="profile-field">
                          <label>Alternate Number</label>
                          <div className="profile-value">{profileData.alternateNumber}</div>
                        </div>
                      )}
                      <div className="profile-field">
                        <label>Address</label>
                        <div className="profile-value">{profileData.address || "N/A"}</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Seller Profile Fields */}
              {userType === "seller" && (
                <div className="profile-fields">
                  <div className="profile-field">
                    <label>Username</label>
                    <div className="profile-value">{profileData.username || "N/A"}</div>
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <div className="profile-value">{profileData.email || "N/A"}</div>
                  </div>
                  {isEditMode ? (
                    <>
                      <div className="profile-field">
                        <label>WhatsApp Number</label>
                        <input
                          type="text"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleInputChange}
                          className="profile-input"
                          placeholder="Enter WhatsApp number"
                        />
                      </div>
                      <div className="profile-field">
                        <label>Business Email</label>
                        <input
                          type="email"
                          name="businessEmail"
                          value={formData.businessEmail}
                          onChange={handleInputChange}
                          className="profile-input"
                          placeholder="Enter business email"
                        />
                      </div>
                      <div className="profile-field">
                        <label>GST Number</label>
                        <input
                          type="text"
                          name="gstNumber"
                          value={formData.gstNumber}
                          onChange={handleInputChange}
                          className="profile-input"
                          placeholder="Enter GST number"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="profile-field">
                        <label>WhatsApp Number</label>
                        <div className="profile-value">{profileData.whatsappNumber || "N/A"}</div>
                      </div>
                      {profileData.businessEmail && (
                        <div className="profile-field">
                          <label>Business Email</label>
                          <div className="profile-value">{profileData.businessEmail}</div>
                        </div>
                      )}
                      {profileData.gstNumber && (
                        <div className="profile-field">
                          <label>GST Number</label>
                          <div className="profile-value">{profileData.gstNumber}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {isEditMode && (
                <div className="profile-actions">
                  <button
                    className="profile-save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    className="profile-cancel-btn"
                    onClick={() => {
                      setIsEditMode(false);
                      setError("");
                      setSuccess("");
                      setPhotoPreview(null);
                      // Reset form data to original profile data
                      if (userType === "user" && profileData) {
                        setFormData({
                          alternateNumber: profileData.alternateNumber || "",
                          address: profileData.address || "",
                          whatsappNumber: "",
                          businessEmail: "",
                          gstNumber: "",
                          photo: null,
                        });
                      } else if (userType === "seller" && profileData) {
                        setFormData({
                          alternateNumber: "",
                          address: "",
                          whatsappNumber: profileData.whatsappNumber || "",
                          businessEmail: profileData.businessEmail || "",
                          gstNumber: profileData.gstNumber || "",
                          photo: null,
                        });
                      }
                      document.getElementById("photo-upload").value = "";
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-error">
              <p>No profile data available. Please login again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
