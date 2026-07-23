import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaSpinner,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import StakeholderFormFields from "./StakeholderFormFields.jsx";
import useStakeholderForm from "../hooks/useStakeholderForm.js";

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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logika form (state, normalisasi data awal, cascading lokasi) berasal
  // dari hook bersama supaya identik dengan AddStakeholderPage.
  const {
    form,
    selectedProvince,
    selectedCity,
    handleChange,
    handleProvinceChange,
    handleCityChange,
  } = useStakeholderForm(formData, locations);

  if (!isOpen) return null;

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
      const errorMessage = err.message || t("stakeholderForm.processing");
      setError(errorMessage);
      setLoading(false); // Reset loading state on error
    }
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
              {t("stakeholderForm.editTitle")}: {form.name || ""}
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
          <div style={{ marginBottom: "25px" }}>
            <StakeholderFormFields
              form={form}
              onChange={handleChange}
              onProvinceChange={handleProvinceChange}
              onCityChange={handleCityChange}
              roles={roles}
              stakeholderTypes={stakeholderTypes}
              strategies={strategies}
              frequencies={frequencies}
              locations={locations}
              selectedProvince={selectedProvince}
              selectedCity={selectedCity}
            />
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
              {t("stakeholderForm.currentStatus")}:
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
              {form.status || "Pending"}
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
              {t("stakeholderForm.cancel")}
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
                ? t("stakeholderForm.processing")
                : userRole?.toLowerCase() === 'admin'
                ? t("stakeholderForm.saveChanges")
                : t("stakeholderForm.submitForApproval")}
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
