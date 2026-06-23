import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const STRATEGY_DESCRIPTIONS = {
  "Key Player": "Actively engage and involve in key decisions. Collaborate closely to align goals, maintain strong relationships, and ensure continued support.",
  "Keep Satisfied": "Manage expectations and ensure interests are addressed. Provide updates on major developments without over-involving in day-to-day activities.",
  "Keep Informed": "Provide regular communication and project updates. Ensure they are aware of developments relevant to their area of interest.",
  "Monitor": "Track engagement needs and monitor for changes. Minimal engagement required — respond promptly if concerns arise.",
  "Check Input": "Verify stakeholder level data to generate an accurate engagement strategy recommendation.",
};

// A simple modal component for the success message
const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          maxWidth: "400px",
          width: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#333",
          }}
        >
          &times;
        </button>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
            fontSize: "16px",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default function DeepAnalysist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stakeholder, setStakeholder] = useState(null);
  const [keyConcerns, setKeyConcerns] = useState([]);
  const [selectedKeyConcern, setSelectedKeyConcern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showKeyConcernDropdown, setShowKeyConcernDropdown] = useState(false);

  const [validationStatus, setValidationStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchValidationStatus = useCallback(async (stakeholderId) => {
    if (!stakeholderId) return;
    try {
      setStatusLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/stakeholder-change-requests/latest-status?stakeholderId=${stakeholderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        // normalisasi kecil: backend mungkin mengembalikan "approved"/"Approved"
        setValidationStatus(data.status ?? null);
      } else {
        setValidationStatus(null);
      }
    } catch (err) {
      console.error("Failed to fetch validation status:", err);
      setValidationStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const fetchStakeholderData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const stakeholderRes = await axios.get(
        `/api/stakeholders/${id}`
      );
      setStakeholder(stakeholderRes.data || null);

      // ambil status validasi (latest change request) supaya semua halaman konsisten
      await fetchValidationStatus(id);
    } catch (err) {
      setError(
        "Gagal memuat data. Pastikan server API berjalan di  dan ID valid."
      );
      console.error("Error fetching data for Deep Analysist:", err);
    } finally {
      setLoading(false);
    }
  }, [id, fetchValidationStatus]);

  // Helper functions for status management (sama seperti di Engagement Priority)
  const getCurrentStatus = () => {
    // Prioritas: validation status (dari change request) > stakeholder status
    if (validationStatus && validationStatus !== stakeholder?.status) {
      return validationStatus;
    }
    return stakeholder?.status || "Unknown";
  };

  const getStatusDisplay = () => {
    if (statusLoading) {
      return "Loading...";
    }
    return getCurrentStatus();
  };

  // Function untuk refresh data setelah ada perubahan
  const refreshStakeholderData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/stakeholders/${id}`
      );
      setStakeholder(response.data);
      
      // Refresh validation status juga
      await fetchValidationStatus(id);
    } catch (error) {
      console.error("Gagal mengambil data stakeholder:", error);
    }
  }, [id, fetchValidationStatus]);

  // useEffect untuk auto-refresh data ketika kembali ke halaman ini
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && id) {
        refreshStakeholderData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id, refreshStakeholderData]);

  useEffect(() => {
    if (id) {
      fetchStakeholderData();
    } else {
      setError("ID Stakeholder tidak ditemukan di URL.");
      setLoading(false);
    }
  }, [id, fetchStakeholderData]);

  const getIntensityColor = (intensity) => {
    switch (intensity?.toUpperCase()) {
      case "HIGH":
        return "#ef4444"; // Red
      case "MEDIUM":
        return "#facc15"; // Yellow
      case "LOW":
        return "#3b82f6"; // Blue
      default:
        return "#facc15";
    }
  };

   const fetchKeyConcerns = useCallback(async () => {
    try {
      const keyConcernsRes = await axios.get(
        "/api/key-concerns"
      );
      setKeyConcerns(keyConcernsRes.data || []);
    } catch (err) {
      console.error("Error fetching key concerns:", err);
    }
  }, []);

  // on mount / id change -> fetch stakeholder + keyConcerns
  useEffect(() => {
    fetchStakeholderData();
    fetchKeyConcerns();
  }, [fetchStakeholderData, fetchKeyConcerns]);

  // Fetch validation status when stakeholder is loaded (sama seperti di Engagement Priority)
  useEffect(() => {
    const fetchValidationStatusForStakeholder = async () => {
      if (!stakeholder || !stakeholder._id) return;

      try {
        setStatusLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/stakeholder-change-requests/latest-status?stakeholderId=${stakeholder._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setValidationStatus(data.status);
        } else {
          setValidationStatus(null);
        }
      } catch (error) {
        console.error("Failed to fetch validation status:", error);
        setValidationStatus(null);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchValidationStatusForStakeholder();
  }, [stakeholder]);

  // Handler for key concern selection
  const handleKeyConcernChange = (concern) => {
    setSelectedKeyConcern(concern);
    setShowKeyConcernDropdown(false);
  };

  // Fungsi navigasi yang sudah diperbaiki
  const handleTriggerClick = () => {
    if (!selectedKeyConcern) {
      setSuccessMessage("Pilih Key Concern terlebih dahulu untuk melanjutkan.");
      setShowSuccessModal(true);
      return;
    }

    const recommendationDataToSend = {
      keyConcern: selectedKeyConcern.key_concern,
      mitigationPlan: selectedKeyConcern.mitigation_plan,
      objective: selectedKeyConcern.objective,
      focalPoint: stakeholder.focalPoints?.recommendedFocalpoint || "-",
      backUp: stakeholder.focalPoints?.backupSupportFocalpoint || "-",
      engagementStrategy:
         stakeholder.engagementStrategy?.strategy ||
  STRATEGY_DESCRIPTIONS[stakeholder.calculatedEngagementStrategy] ||
  stakeholder.calculatedEngagementStrategy,
      engagementFrequency: stakeholder.engagementFrequency?.name || "-",
      triggerReason: `Moderate concerns; Medium Risk;\nPlan timely engagement.`, // Placeholder
      reEngagementStatus: "Re-engage", // Placeholder
    };

    navigate(`/deep-analysist2/${id}`, {
      state: { recommendationData: recommendationDataToSend },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          color: "#374151",
        }}
      >
        Memuat data analisis mendalam...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          color: "#dc2626",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Error: {error}
        <p style={{ fontSize: "16px", marginTop: "10px" }}>
          Pastikan server backend berjalan dan ID stakeholder valid.
        </p>
      </div>
    );
  }

  if (!stakeholder) {
    return (
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          color: "#374151",
        }}
      >
        Data stakeholder tidak ditemukan untuk analisis mendalam.
      </div>
    );
  }

  const formatLocation = (location) => {
    const parts = [];
    if (location?.district) {
      parts.push(location.district);
    }
    if (location?.city) {
      parts.push(location.city);
    }
    if (location?.province?.name) {
      parts.push(location.province.name);
    }
    return parts.join(", ") || "[Lokasi Tidak Tersedia]";
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          padding: 5,
        }}
      >
        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: "90px 50px 30px",
            gap: "20px",
          }}
        >
          {/* Left Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Profile Card */}
            <div
              style={{
                backgroundImage: 'url("/images/bgda.png")',
                backgroundSize: "cover",
                borderRadius: 20,
                padding: 30,
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 25,
                }}
              >
                {/* Kiri: Foto & Nama */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <img
                    src="/icons/profile.png"
                    alt="profile"
                    style={{ width: 90, height: 90, borderRadius: "50%", flexShrink: 0 }}
                  />
                  <div>
                    <h2 style={{ fontSize: 26, fontWeight: "bold", margin: "0 0 4px 0", textAlign: "left" }}>
                      {stakeholder.name}
                    </h2>
                    <p style={{ fontSize: 14, margin: 0, opacity: 0.85, textAlign: "left" }}>
                      {stakeholder.role?.name || ""}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "stretch" }}>
                {["Location", "Contact"].map((label) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      padding: 3,
                      borderRadius: 16,
                      background: "linear-gradient(to right, #6C6DCB, #204C92)",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: 14,
                        padding: "12px 20px",
                        fontWeight: "bold",
                        color: "#1E3A8A",
                        textAlign: "left",
                        height: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {label}:{" "}
                      {label === "Location"
                        ? formatLocation(stakeholder.location)
                        : stakeholder.contact || "-"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stakeholder Type */}
              <div
                style={{
                  padding: 3,
                  borderRadius: 16,
                  background: "linear-gradient(to right, #6C6DCB, #204C92)",
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#000" }}>
                    Stakeholder Type:
                  </div>
                  <div
                    style={{
                      backgroundColor: "#E9F7DF",
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      color: "#065f46",
                      padding: "5px 12px",
                      borderRadius: 12,
                      width: 220,
                      textAlign: "center",
                    }}
                  >
                    {stakeholder.stakeholderType?.name || "-"}
                  </div>
                </div>
              </div>

              {/* Engagement Category */}
              <div
                style={{
                  padding: 3,
                  borderRadius: 16,
                  background: "linear-gradient(to right, #6C6DCB, #204C92)",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#000" }}>
                    Engagement Category:
                  </div>
                  <div
                    style={{
                      backgroundColor: "#D2E3EB",
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      color: "#374151",
                      padding: "5px 12px",
                      borderRadius: 12,
                      width: 220,
                      textAlign: "center",
                    }}
                  >
                    {stakeholder.engagementCategory}
                  </div>
                </div>
              </div>

              {/* Status with glass effect */}
              <div
                style={{
                  padding: 3,
                  borderRadius: 16,
                  background: "linear-gradient(to right, #8CB6CB, #204D93)",
                  marginBottom: 1,
                }}
              >
                <div
                  style={{
                    backdropFilter: "blur(10px)",
                    padding: 10,
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#ffffff",
                      fontSize: "20px",
                    }}
                  >
                    Status:
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(to right, #98BFE1 0%, #7C9BCC 100%)",
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      color: "#374151",
                      padding: "5px 84px",
                      borderRadius: 12,
                      minWidth: 180,
                      textAlign: "center",
                      opacity: statusLoading ? 0.7 : 1,
                    }}
                  >
                    {getStatusDisplay()}
                  </div>
                </div>
              </div>

              {/* Semua baris pakai struktur sama: flex:1 label + flex:2 value */}
              {[
                { label: "Engagement Strategy", value: stakeholder.calculatedEngagementStrategy || "-", valueStyle: { background: "linear-gradient(to right, #F5FFEF 0%, #B8F580 100%)", color: "black" } },
                { label: "Influence", value: stakeholder.influenceLevel ? stakeholder.influenceLevel.charAt(0).toUpperCase() + stakeholder.influenceLevel.slice(1) : "-" },
                { label: "Interest", value: stakeholder.interestLevel ? stakeholder.interestLevel.charAt(0).toUpperCase() + stakeholder.interestLevel.slice(1) : "-" },
                { label: "Engagement Intensity", value: stakeholder.engagementIntensity ? stakeholder.engagementIntensity.charAt(0).toUpperCase() + stakeholder.engagementIntensity.slice(1) : "-", valueStyle: { backgroundColor: getIntensityColor(stakeholder.engagementIntensity), color: "black" } },
                { label: "Risk Level", value: stakeholder.riskLevel ? stakeholder.riskLevel.charAt(0).toUpperCase() + stakeholder.riskLevel.slice(1) : "-" },
                { label: "Opportunity", value: stakeholder.opportunityLevel ? stakeholder.opportunityLevel.charAt(0).toUpperCase() + stakeholder.opportunityLevel.slice(1) : "-" },
                { label: "Benefit", value: stakeholder.benefitLevel ? stakeholder.benefitLevel.charAt(0).toUpperCase() + stakeholder.benefitLevel.slice(1) : "-" },
              ].map(({ label, value, valueStyle }) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 6, marginTop: 6 }}>
                  <div style={{ flex: 1, padding: 3, borderRadius: 16, background: "linear-gradient(to right, #6C6DCB, #204C92)" }}>
                    <div style={{ backgroundColor: "#ffffff", color: "#1e293b", padding: "8px 16px", borderRadius: 12, fontWeight: "bold", whiteSpace: "nowrap" }}>
                      {label}:
                    </div>
                  </div>
                  <div style={{ flex: 2, padding: 3, borderRadius: 16, background: "linear-gradient(to right, #6C6DCB, #204C92)" }}>
                    <div style={{
                      background: "linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.4), rgba(255,255,255,0.8))",
                      color: "#1e293b",
                      textAlign: "center",
                      padding: "8px 16px",
                      borderRadius: 12,
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      ...valueStyle,
                    }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}

              {/* Final Recommendation */}
              <div style={{ marginTop: 20 }}>
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Final Recommendation
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    justifyContent: "space-between",
                  }}
                >
                  {[
                    stakeholder.finalRecommendations?.engagementPriority ||
                      "Maintain engagement & respond to issues",
                    stakeholder.finalRecommendations
                      ?.engagementPriorityDescription ||
                      "Continue communication and respond to stakeholder feedback and concerns as needed.",
                  ].map((text, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.3)",
                        mixBlendMode: "normal",
                        backgroundBlendMode: "plus-lighter",
                        boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                        backdropFilter: "blur(20px)",
                        padding: 15,
                        borderRadius: 16,
                        flex: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                backgroundImage: 'url("/images/backgroundright.png")',
                backgroundSize: "cover",
                borderRadius: 24,
                padding: 20,
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                position: "relative",
              }}
            >
              {/* Key Concern Dropdown & Display */}
              <div
                style={{
                  position: "relative",
                  marginTop: 20,
                  marginBottom: 6,
                  padding: 22,
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "16px",
                  backgroundColor: "rgba(67, 137, 245, 0.5)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-18px",
                    left: "20px",
                    background: "linear-gradient(to bottom, #256BAD, #0A172C)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "1px solid #1976D2",
                  }}
                >
                  Key Concern
                </div>

                {/* Trigger Dropdown */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#1E3A8A",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    lineHeight: "1.5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setShowKeyConcernDropdown(!showKeyConcernDropdown)
                  }
                >
                  <span style={{ flex: 1 }}>
                    {selectedKeyConcern
                      ? selectedKeyConcern.key_concern
                      : "Please choose the key concern to be processed"}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>

                {/* Dropdown List */}
                {showKeyConcernDropdown && (
                  <ul
                    style={{
                      marginTop: 10,
                      background: "#ffffff",
                      color: "#000",
                      borderRadius: 10,
                      padding: 10,
                      listStyle: "none",
                      maxHeight: 220,
                      overflowY: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 99,
                    }}
                  >
                    {keyConcerns.map((concern) => (
                      <li
                        key={concern._id}
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #e5e7eb",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                        onClick={() => handleKeyConcernChange(concern)}
                      >
                        {concern.key_concern}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Engagement Strategy */}
              <div
                style={{
                  position: "relative",
                  marginTop: 20,
                  padding: 22,
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "16px",
                  backgroundColor: "rgba(67, 137, 245, 0.5)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-18px",
                    left: "20px",
                    background: "linear-gradient(to bottom, #256BAD, #0A172C)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "1px solid #1976D2",
                  }}
                >
                  Engagement Strategy
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#000",
                    borderRadius: "12px",
                    padding: "20px",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "1.5",
                  }}
                >
                  {stakeholder.engagementStrategy?.strategy ||
                    STRATEGY_DESCRIPTIONS[stakeholder.calculatedEngagementStrategy] ||
                    "-"}
                </div>
              </div>

              {/* Engagement Frequency */}
              <div
                style={{
                  margin: "5px 0",
                  padding: "20px 35px",
                  border: "1px solid #d4c7c7ff",
                  borderRadius: "16px",
                  background: "linear-gradient(to bottom, #256BAD, #0A172C)",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                  fontSize: 17,
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: 17 }}>
                  Engagement Frequency
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold", fontSize: 17 }}>
                    {stakeholder.engagementFrequency?.name || "Monthly"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.8)",
                      maxWidth: "250px",
                    }}
                  >
                    {stakeholder.engagementFrequency?.description ||
                      "H-M/ Standard for local government, impacted communities, and labor groups."}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Details */}
            <div
              style={{
                background: 'url("/images/bgr.png")',
                borderRadius: 20,
                backgroundSize: "cover",
                padding: 19,
                color: "white",
              }}
            >
              <h3
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 20px 0",
                }}
              >
                Recommendation
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 15,
                  marginBottom: 15,
                }}
              >
                {/* Mitigation Plan */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    padding: 20,
                    borderRadius: 15,
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: 20,
                      background:
                        "linear-gradient(to bottom, #8DC8FF, #6B9EFF)",
                      padding: "8px 16px",
                      borderRadius: 12,
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    Mitigation Plan
                  </h4>
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#000",
                      padding: 15,
                      borderRadius: 10,
                      textAlign: "center",
                      fontWeight: "600",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {selectedKeyConcern?.mitigation_plan ||
                      "Pilih Key Concern untuk melihat Mitigation Plan"}
                  </div>
                </div>

                {/* Objective */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    padding: 20,
                    borderRadius: 15,
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: 20,
                      background:
                        "linear-gradient(to bottom, #8DC8FF, #6B9EFF)",
                      padding: "8px 16px",
                      borderRadius: 12,
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    Objective
                  </h4>
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#000",
                      padding: 15,
                      textAlign: "center",
                      borderRadius: 10,
                      fontWeight: "600",
                    }}
                  >
                    {selectedKeyConcern?.objective ||
                      "Pilih Key Concern untuk melihat Objective"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 15,
                }}
              >
                {/* Focal Point */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    padding: 20,
                    borderRadius: 15,
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: 20,
                      background:
                        "linear-gradient(to bottom, #8DC8FF, #6B9EFF)",
                      padding: "8px 16px",
                      borderRadius: 12,
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    Focal Point
                  </h4>
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#000",
                      padding: 15,
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: 14,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {selectedKeyConcern
                      ? stakeholder.focalPoints?.recommendedFocalpoint || "-"
                      : "Pilih Key Concern untuk melihat Focal Point"}
                  </div>
                </div>

                {/* Back up */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    padding: 20,
                    borderRadius: 15,
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      background:
                        "linear-gradient(to bottom, #8DC8FF, #6B9EFF)",
                      padding: "8px 16px",
                      borderRadius: 12,
                      margin: "0 0 10px 0",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    Back up
                  </h4>
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#000",
                      padding: 15,
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: 14,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {selectedKeyConcern
                      ? stakeholder.focalPoints?.backupSupportFocalpoint || "-"
                      : "Pilih Key Concern untuk melihat Backup Support"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div
          style={{
            marginTop: 16,
            marginBottom: 20,
            display: "flex",
            paddingRight: "50px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleTriggerClick}
            style={{
              background: "linear-gradient(to right, #FFB027, #CC7F20)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: "bold" }}>Trigger</span>
              <img src="/icons/nextyellow.png" alt="next" style={{ width: 36, height: 28 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: "normal", opacity: 0.9 }}>
              Click the trigger button if re-engagement is needed
            </span>
          </button>
        </div>

        {/* Render the SuccessModal when showSuccessModal is true */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />
      </div>
    </>
  );
}