import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api, { API_BASE_URL } from "../utils/api";
import Navbar from "../components/Navbar";
import i18n from "../i18n/config.js";

// Deskripsi strategi mengikuti bahasa aktif (ID/EN) melalui i18n.
const getStrategyDescriptions = () => ({
  "Key Player": i18n.t("deepAnalysist.strategyDescriptions.keyPlayer"),
  "Keep Satisfied": i18n.t("deepAnalysist.strategyDescriptions.keepSatisfied"),
  "Keep Informed": i18n.t("deepAnalysist.strategyDescriptions.keepInformed"),
  "Monitor": i18n.t("deepAnalysist.strategyDescriptions.monitor"),
  "Check Input": i18n.t("deepAnalysist.strategyDescriptions.checkInput"),
});



// A simple modal component for the success message
const SuccessModal = ({ isOpen, onClose, message }) => {
  const { t } = useTranslation();
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
          {t("deepAnalysist.modalOk")}
        </button>
      </div>
    </div>
  );
};

export default function DeepAnalysist() {
  const { t } = useTranslation();
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
        `${API_BASE_URL}/api/stakeholder-change-requests/latest-status?stakeholderId=${stakeholderId}`,
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
      const stakeholderRes = await api.get(
        `/api/stakeholders/${id}`
      );
      setStakeholder(stakeholderRes.data || null);

      // ambil status validasi (latest change request) supaya semua halaman konsisten
      await fetchValidationStatus(id);
    } catch (err) {
      setError(
        t("deepAnalysist.loadError")
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
    return stakeholder?.status || t("deepAnalysist.unknown");
  };

  const translateKeyConcern = (text) => {
    if (!text) return "";
    if (i18n.language === "id") {
      const trimmed = text.trim();
      const bundle = i18n.getResourceBundle("id", "translation");
      const dict = bundle?.deepAnalysist?.keyConcerns;
      if (dict && dict[trimmed]) {
        return dict[trimmed];
      }
    }
    return text;
  };

  const translateMitigationPlan = (text) => {
    if (!text) return "";
    if (i18n.language === "id") {
      const trimmed = text.trim();
      const bundle = i18n.getResourceBundle("id", "translation");
      const dict = bundle?.deepAnalysist?.mitigationPlans;
      if (dict && dict[trimmed]) {
        return dict[trimmed];
      }
    }
    return text;
  };

  const translateObjective = (text) => {
    if (!text) return "";
    if (i18n.language === "id") {
      const trimmed = text.trim();
      const bundle = i18n.getResourceBundle("id", "translation");
      const dict = bundle?.deepAnalysist?.objectives;
      if (dict && dict[trimmed]) {
        return dict[trimmed];
      }
    }
    return text;
  };

  const getStatusDisplay = () => {
    if (statusLoading) {
      return t("deepAnalysist.loading");
    }
    const rawStatus = getCurrentStatus();
    return t(`dashboard.card.statuses.${rawStatus}`, rawStatus);
  };

  // Function untuk refresh data setelah ada perubahan
  const refreshStakeholderData = useCallback(async () => {
    try {
      const response = await api.get(
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
      setError(t("deepAnalysist.idMissingError"));
      setLoading(false);
    }
  }, [id, fetchStakeholderData]);

  const formatLevel = (level) => {
    if (!level) return "-";
    const normalized = level.trim().toLowerCase();
    if (normalized === "high") return t("common.high", "Tinggi");
    if (normalized === "medium") return t("common.medium", "Sedang");
    if (normalized === "low") return t("common.low", "Rendah");
    if (normalized === "very high" || normalized === "very_high") return t("engagementPriority.intensities.Very High", "Sangat Tinggi");
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getIntensityColor = (intensity) => {
    const norm = intensity?.trim()?.toUpperCase() || "";
    if (norm.includes("HIGH") || norm.includes("TINGGI")) return "#ef4444";
    if (norm.includes("MEDIUM") || norm.includes("SEDANG")) return "#facc15";
    if (norm.includes("LOW") || norm.includes("RENDAH")) return "#3b82f6";
    return "#facc15";
  };

   const fetchKeyConcerns = useCallback(async () => {
    try {
      const keyConcernsRes = await api.get(
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
          `${API_BASE_URL}/api/stakeholder-change-requests/latest-status?stakeholderId=${stakeholder._id}`,
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
      setSuccessMessage(t("deepAnalysist.selectKeyConcernFirst"));
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
  getStrategyDescriptions()[stakeholder.calculatedEngagementStrategy] ||
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
        {t("deepAnalysist.loadingText")}
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
          {t("deepAnalysist.errorHint")}
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
        {t("deepAnalysist.notFound")}
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
    return parts.join(", ") || t("deepAnalysist.locationUnavailable");
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
                      {stakeholder.role?.name ? t(`dashboard.card.roles.${stakeholder.role.name}`, stakeholder.role.name) : ""}
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
                      {label === "Location" ? t("deepAnalysist.fields.location") : t("deepAnalysist.fields.contact")}:{" "}
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
                    {t("deepAnalysist.fields.stakeholderType")}:
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
                    {stakeholder.stakeholderType?.name ? t(`dashboard.card.types.${stakeholder.stakeholderType.name}`, stakeholder.stakeholderType.name) : "-"}
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
                    {t("deepAnalysist.fields.engagementCategory")}:
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
                    {t(`dashboard.card.categories.${stakeholder.engagementCategory}`, stakeholder.engagementCategory)}
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
                    {t("deepAnalysist.fields.status")}:
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
                { label: t("deepAnalysist.fields.engagementStrategy"), value: stakeholder.calculatedEngagementStrategy ? t(`engagementPriority.strategies.${stakeholder.calculatedEngagementStrategy}`, stakeholder.calculatedEngagementStrategy) : "-", valueStyle: { background: "linear-gradient(to right, #F5FFEF 0%, #B8F580 100%)", color: "black" } },
                { label: t("deepAnalysist.fields.influence"), value: formatLevel(stakeholder.influenceLevel) },
                { label: t("deepAnalysist.fields.interest"), value: formatLevel(stakeholder.interestLevel) },
                { label: t("deepAnalysist.fields.engagementIntensity"), value: stakeholder.engagementIntensity ? t(`engagementPriority.intensities.${stakeholder.engagementIntensity}`, formatLevel(stakeholder.engagementIntensity)) : "-", valueStyle: { backgroundColor: getIntensityColor(stakeholder.engagementIntensity), color: "black" } },
                { label: t("deepAnalysist.fields.riskLevel"), value: formatLevel(stakeholder.riskLevel) },
                { label: t("deepAnalysist.fields.opportunity"), value: formatLevel(stakeholder.opportunityLevel) },
                { label: t("deepAnalysist.fields.benefit"), value: formatLevel(stakeholder.benefitLevel) },
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
                  {t("deepAnalysist.finalRecommendationTitle")}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    justifyContent: "space-between",
                  }}
                >
                  {(() => {
                    const mainRecKey = stakeholder.finalRecommendations?.engagementPriority || stakeholder.engagementPriority || "";
                    const detailRecKey = stakeholder.finalRecommendations?.engagementPriorityDescription || "";

                    const mainRecText = mainRecKey
                      ? t(`engagementPriority.recommendations.${mainRecKey}`, mainRecKey)
                      : t("deepAnalysist.defaultRecommendationMain");

                    const detailRecText = mainRecKey
                      ? t(`engagementPriority.recommendationDescriptions.${mainRecKey}`, detailRecKey || t("deepAnalysist.defaultRecommendationDetail"))
                      : t("deepAnalysist.defaultRecommendationDetail");

                    return [mainRecText, detailRecText].map((text, index) => (
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
                    ));
                  })()}
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
                  {t("deepAnalysist.keyConcernLabel")}
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
                      ? translateKeyConcern(selectedKeyConcern.key_concern)
                      : t("deepAnalysist.keyConcernPlaceholder")}
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
                        {translateKeyConcern(concern.key_concern)}
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
                  {t("deepAnalysist.engagementStrategyLabel")}
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
                    getStrategyDescriptions()[stakeholder.calculatedEngagementStrategy] ||
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
                  {t("deepAnalysist.engagementFrequencyLabel")}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold", fontSize: 17 }}>
                    {stakeholder.engagementFrequency?.name || t("deepAnalysist.defaultFrequency")}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.8)",
                      maxWidth: "250px",
                    }}
                  >
                    {stakeholder.engagementFrequency?.description ||
                      t("deepAnalysist.defaultFrequencyDescription")}
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
                {t("deepAnalysist.recommendationTitle")}
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
                    {t("deepAnalysist.mitigationPlanTitle")}
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
                    {selectedKeyConcern
                      ? translateMitigationPlan(selectedKeyConcern.mitigation_plan)
                      : t("deepAnalysist.mitigationPlanPlaceholder")}
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
                    {t("deepAnalysist.objectiveTitle")}
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
                    {selectedKeyConcern
                      ? translateObjective(selectedKeyConcern.objective)
                      : t("deepAnalysist.objectivePlaceholder")}
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
                    {t("deepAnalysist.focalPointTitle")}
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
                      : t("deepAnalysist.focalPointPlaceholder")}
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
                    {t("deepAnalysist.backupTitle")}
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
                      : t("deepAnalysist.backupPlaceholder")}
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
              <span style={{ fontSize: 18, fontWeight: "bold" }}>{t("deepAnalysist.triggerButton")}</span>
              <img src="/icons/nextyellow.png" alt="next" style={{ width: 36, height: 28 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: "normal", opacity: 0.9 }}>
              {t("deepAnalysist.triggerButtonSubtitle")}
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