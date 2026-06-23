import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhone,
  FaHandshake,
  FaChartLine,
  FaExclamationTriangle,
  FaStar,
  FaLightbulb,
  FaBullseye,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaSpinner,
  FaUsers,
} from "react-icons/fa";

export default function EditStakeholderModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  userRole,
  roles = [],
  stakeholderTypes = [],
  strategies = [],
  frequencies = [],
  locations = [],
}) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (formData) {
      const initialForm = {
        ...formData,
        influence: (formData.influence || formData.influenceLevel)?.toLowerCase() || "",
        interest: (formData.interest || formData.interestLevel)?.toLowerCase() || "",
        riskLevel: (formData.riskLevel)?.toLowerCase() || "",
        opportunity: (formData.opportunity || formData.opportunityLevel)?.toLowerCase() || "",
        benefit: (formData.benefit || formData.benefitLevel)?.toLowerCase() || "",
        role: formData.role?._id || "",
        stakeholderType: formData.stakeholderType?._id || "",
        engagementFrequency: formData.engagementFrequency?._id || "",
        engagementStrategy: formData.engagementStrategy?._id || "",
        location: {
          province: formData.location?.province?._id || "",
          city: formData.location?.city || "",
          district: formData.location?.district || "",
        },
      };
      setForm(initialForm);

      const initialProvince = locations.find(
        (loc) => loc._id === initialForm.location.province
      );
      setSelectedProvince(initialProvince);
      if (initialProvince && initialForm.location.city) {
        const initialCity = initialProvince.cities?.find(
          (city) => city.name === initialForm.location.city
        );
        setSelectedCity(initialCity);
      }
    }
  }, [formData, locations]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const provinceObject = locations.find((loc) => loc._id === provinceId);

    setForm((prev) => ({
      ...prev,
      location: {
        province: provinceId,
        city: "",
        district: "",
      },
    }));
    setSelectedProvince(provinceObject);
    setSelectedCity(null);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const cityObject = selectedProvince?.cities?.find(
      (city) => city.name === cityName
    );

    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: cityName,
        district: "",
      },
    }));
    setSelectedCity(cityObject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    setLoading(true);
    setError("");

    try {
      // Prepare the payload
      const updatedData = {
        ...form,
        _id: formData._id,
        location: {
          province: form.location.province,
          city: form.location.city,
          district: form.location.district,
        },
      };

      if (onSubmit) {
        await onSubmit(updatedData);
      }
      
      // Modal akan ditutup oleh parent component setelah success

    } catch (err) {
      console.error("Error in modal form submission:", err);
      const errorMessage = err.message || "Gagal memproses permintaan. Silakan coba lagi.";
      setError(errorMessage);
      setLoading(false); // Reset loading state on error
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#374151",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage:
      'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "12px",
    paddingRight: "35px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#374151",
    fontSize: "14px",
    gap: "8px",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "SF Pro Display, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#F0F8FF",
          padding: "25px 30px",
          borderRadius: "24px",
          width: "min(95%, 800px)",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: "1px solid #d1d5db",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FaEdit size={28} color="#3B82F6" />
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#3B82F6",
                margin: 0,
              }}
            >
              Edit Stakeholder: {form.name || ""}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: "0",
              lineHeight: "1",
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px 30px",
              marginBottom: "25px",
            }}
          >
            {/* Nama Stakeholder */}
            <div>
              <label style={labelStyle}>
                <FaUserCircle />
                Stakeholder Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>
                <FaUsers />
                Role/Position
              </label>
              <select
                name="role"
                value={form.role || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location - Province */}
            <div>
              <label style={labelStyle}>
                <FaMapMarkerAlt />
                Province
              </label>
              <select
                name="location.province"
                value={form.location?.province || ""}
                onChange={handleProvinceChange}
                style={selectStyle}
                required
              >
                <option value="">Select Province</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location - City */}
            <div>
              <label style={labelStyle}>
                <FaBuilding />
                City
              </label>
              <select
                name="location.city"
                value={form.location?.city || ""}
                onChange={handleCityChange}
                style={selectStyle}
                disabled={!selectedProvince}
                required
              >
                <option value="">Select City</option>
                {selectedProvince?.cities?.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location - District */}
            <div>
              <label style={labelStyle}>
                <FaBuilding />
                District
              </label>
              <select
                name="location.district"
                value={form.location?.district || ""}
                onChange={handleChange}
                style={selectStyle}
                disabled={!selectedCity}
              >
                <option value="">Select District</option>
                {selectedCity?.districts?.map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact */}
            <div>
              <label style={labelStyle}>
                <FaPhone />
                Contact
              </label>
              <input
                type="text"
                name="contact"
                value={form.contact || ""}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Email or phone number"
              />
            </div>

            {/* Stakeholder Type */}
            <div>
              <label style={labelStyle}>
                <FaUsers />
                Stakeholder Type *
              </label>
              <select
                name="stakeholderType"
                value={form.stakeholderType || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Stakeholder Type</option>
                {stakeholderTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Engagement Category */}
            <div>
              <label style={labelStyle}>
                <FaChartLine />
                Engagement Category
              </label>
              <select
                name="engagementCategory"
                value={form.engagementCategory || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Category</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Tertiary">Tertiary</option>
              </select>
            </div>

            {/* Influence */}
            <div>
              <label style={labelStyle}>
                <FaStar />
                Influence
              </label>
              <select
                name="influence"
                value={form.influence || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Influence</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Interest */}
            <div>
              <label style={labelStyle}>
                <FaStar />
                Interest
              </label>
              <select
                name="interest"
                value={form.interest || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Interest</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Risk Level */}
            <div>
              <label style={labelStyle}>
                <FaExclamationTriangle />
                Risk Level
              </label>
              <select
                name="riskLevel"
                value={form.riskLevel || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Risk Level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Opportunity */}
            <div>
              <label style={labelStyle}>
                <FaLightbulb />
                Opportunity
              </label>
              <select
                name="opportunity"
                value={form.opportunity || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Opportunity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Benefit */}
            <div>
              <label style={labelStyle}>
                <FaBullseye />
                Benefit
              </label>
              <select
                name="benefit"
                value={form.benefit || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Benefit</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Engagement Strategy */}
            <div>
              <label style={labelStyle}>
                <FaHandshake />
                Engagement Strategy
              </label>
              <select
                name="engagementStrategy"
                value={form.engagementStrategy || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Strategy</option>
                {strategies.map((strategy) => (
                  <option key={strategy._id} value={strategy._id}>
                    {strategy.strategy}
                  </option>
                ))}
              </select>
            </div>

            {/* Engagement Frequency */}
            <div>
              <label style={labelStyle}>
                <FaCalendarAlt />
                Engagement Frequency
              </label>
              <select
                name="engagementFrequency"
                value={form.engagementFrequency || ""}
                onChange={handleChange}
                style={selectStyle}
                required
              >
                <option value="">Select Frequency</option>
                {frequencies.map((frequency) => (
                  <option key={frequency._id} value={frequency._id}>
                    {frequency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Display */}
          <div
            style={{
              marginBottom: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontWeight: "600",
                color: "#374151",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {form.status === "Approved" ? (
                <FaCheckCircle color="#22C55E" />
              ) : (
                <FaTimesCircle color="#EF4444" />
              )}
              Current Status:
            </div>
            <div
              style={{
                backgroundColor:
                  form.status === "Approved" ? "#D1FAE5" : "#FEE2E2",
                color: form.status === "Approved" ? "#047857" : "#DC2626",
                padding: "8px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {form.status || "Valid"}
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: "#F3F4F6",
                color: "#374151",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1px solid #D1D5DB",
                fontSize: "16px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? "#9CA3AF"
                  : userRole?.toLowerCase() === 'admin'
                  ? "linear-gradient(to right, #059669, #047857)"
                  : "linear-gradient(to right, #3B82F6, #2563EB)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: loading
                  ? "none"
                  : "0 4px 15px rgba(59, 130, 246, 0.3)",
              }}
            >
              {loading && <FaSpinner className="spin" />}
              {loading 
                ? "Processing..." 
                : userRole?.toLowerCase() === 'admin'
                ? "Save Changes"
                : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}