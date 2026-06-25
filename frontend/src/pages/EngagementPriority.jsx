import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { API_BASE_URL } from "../utils/api";
import EditStakeholderModal from "../components/EditStakeholderModal.jsx";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DataContext } from "../context/DataContext";

export default function EngagementPriority() {
  const { id } = useParams();
  const { updateStakeholderStatus } = useContext(DataContext);

  const [stakeholder, setStakeholder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [roles, setRoles] = useState([]);
  const [stakeholderTypes, setStakeholderTypes] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const currentUserRole = localStorage.getItem("role") || "";
  const toggleMenu = () => setShowMenu(!showMenu);
  const navigate = useNavigate();

  const [validationStatus, setValidationStatus] = useState(null);
  const [validationDate, setValidationDate] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [selectedStakeholder] = React.useState(null);

  useEffect(() => {
    const fetchValidationStatus = async () => {
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
          setValidationDate(data.reviewedAt);
        } else {
          setValidationStatus(null);
          setValidationDate(null);
        }
        console.log(stakeholder.stakeholderType);
        
      } catch (error) {
        console.error("Failed to fetch validation status:", error);
        setValidationStatus(null);
        setValidationDate(null);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchValidationStatus();
  }, [stakeholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          stakeholderRes,
          rolesRes,
          stakeholderTypesRes,
          strategiesRes,
          frequenciesRes,
          locationsRes,
        ] = await Promise.all([
          api.get(`/api/stakeholders/${id}`),
          api.get("/api/roles"),
          api.get(`/api/stakeholder-types`),
          api.get("/api/engagement-strategies"),
          api.get("/api/engagement-frequencies"),
          api.get("/api/locations"),
        ]);
        console.log(stakeholderRes);
        
        setStakeholder(stakeholderRes.data);
        setRoles(rolesRes.data);
        setStakeholderTypes(stakeholderTypesRes.data);
        setStrategies(strategiesRes.data);
        setFrequencies(frequenciesRes.data);
        setLocations(locationsRes.data);
      } catch (err) {
        setError("Gagal memuat data. Pastikan server API berjalan.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("ID Stakeholder tidak ditemukan di URL.");
      setLoading(false);
    }
  }, [id]);

  // Helper functions for status management
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
    if (validationStatus) {
      const formattedDate = validationDate
        ? new Date(validationDate).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        : "";
      return `${validationStatus} On ${formattedDate}`;
    }
    return `Unknown`;
  };

  const getIntensityStyle = (intensity) => {
    switch (intensity?.toUpperCase()) {
      case "VERY HIGH":
        return { background: "linear-gradient(to right, #FF5F6D 0%, #FFC371 100%)" };
      case "HIGH":
        return { background: "linear-gradient(to right, #FF8C42 0%, #FFD166 100%)" };
      case "MEDIUM":
        return { background: "linear-gradient(to right, #FFE3B2 0%, #FFAF26 100%)" };
      case "LOW":
        return { background: "linear-gradient(to right, #B2E3FF 0%, #26C6FF 100%)" };
      case "KEY PLAYER":
        return { background: "linear-gradient(to right, #F5FFEF 0%, #B8F580 100%)", color: "black" };
      case "KEEP SATISFIED":
        return { background: "linear-gradient(to right, #E0F7FA 0%, #26C6DA 100%)" };
      case "KEEP INFORMED":
        return { background: "linear-gradient(to right, #FFF8E1 0%, #FFD54F 100%)", color: "black" };
      case "MONITOR":
        return { background: "linear-gradient(to right, #F3E5F5 0%, #CE93D8 100%)" };
      default:
        return { background: "#e5e7eb", color: "black" };
    }
  };

  const handleEditClick = () => {
    if (stakeholder) {
      console.log("Opening edit modal with stakeholder data:", stakeholder);
      setShowEditForm(true);
      setShowMenu(false);
    } else {
      alert("Data stakeholder belum dimuat. Tidak bisa mengedit.");
    }
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const submitChangeRequest = async (stakeholderId, changeData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stakeholder-change-requests/${stakeholderId}/request-change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(changeData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit change request");
      }

      const result = await response.json();
      console.log("Change request submitted successfully:", result);
      return true;
    } catch (error) {
      console.error("Failed to submit change request:", error);
      alert(`Failed to submit change request: ${error.message}`);
      return false;
    }
  };

  const fetchStakeholderData = async () => {
    try {
      const response = await api.get(
        `/api/stakeholders/${id}`
      );
      setStakeholder(response.data);
    } catch (error) {
      console.error("Gagal mengambil data stakeholder:", error);
    }
  };

  const handleSaveEditForm = async (updatedData) => {
    try {
      setError("");
      console.log("=== Parent Form submission started ===");
      console.log("User role:", currentUserRole);
      console.log("Updated data:", updatedData);

      // Jika user role bukan admin, submit change request
      if (currentUserRole !== "bpma") {
        const success = await submitChangeRequest(updatedData._id, updatedData);
        if (success) {
          setShowEditForm(false);
          setShowSuccessPopup(true);

          // Delay dan panggil ulang data stakeholder dan status validasi
          setTimeout(async () => {
            await fetchStakeholderData();
            try {
              setStatusLoading(true);
              const token = localStorage.getItem("token");
              const res = await fetch(
                `/api/stakeholder-change-requests/latest-status?stakeholderId=${updatedData._id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (res.ok) {
                const data = await res.json();
                setValidationStatus(data.status);
              }
            } catch (error) {
              console.error("Failed to refresh validation status:", error);
            } finally {
              setStatusLoading(false);
            }
          }, 1000);
        }
        return;
      }

      // Direct update for admin
      const response = await api.put(
        `/api/stakeholders/${updatedData._id}`,
        updatedData
      );

      if (response.status === 200) {
        setStakeholder(response.data);

        if (updateStakeholderStatus) {
          updateStakeholderStatus(updatedData._id, response.data.status);
        }

        // Clear validation status karena sudah direct update
        setValidationStatus(null);

        // Close modal dan show success
        setShowEditForm(false);
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error("Gagal update stakeholder:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gagal update stakeholder. Silakan coba lagi.";
      setError(errorMessage);
      // JANGAN tutup modal jika ada error, biar user bisa coba lagi
    }
  };
  const submitDeletionRequest = async (stakeholderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stakeholder-change-requests/${stakeholderId}/request-deletion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit deletion request"
        );
      }

      const result = await response.json();
      console.log("Deletion request submitted successfully:", result);
      return true;
    } catch (error) {
      console.error("Failed to submit deletion request:", error);
      alert(`Failed to submit deletion request: ${error.message}`);
      return false;
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!stakeholder || !stakeholder._id) {
      alert("Stakeholder ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Sesi Anda berakhir. Silakan login kembali.");
        return;
      }

      setError("");

      if (currentUserRole !== "bpma") {
        const success = await submitDeletionRequest(stakeholder._id);
        if (success) {
          setShowDeleteModal(false);
          setShowSuccessPopup(true);
        }
        return;
      }

      // Direct delete for BPMA
      const response = await api.delete(
        `/api/stakeholders/${stakeholder._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // 1. Tutup modal konfirmasi
        setShowDeleteModal(false);

        // 2. Tampilkan pop-up sukses
        setShowSuccessPopup(true);

        // 3. Tunggu 2 detik sebelum navigasi
        setTimeout(() => {
          // 4. Arahkan pengguna ke dashboard
          navigate('/dashboard');
        }, 2000); // 2000ms = 2 detik
      }
    } catch (error) {
      console.error("Gagal menghapus stakeholder:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gagal menghapus stakeholder. Silakan coba lagi.";
      setError(errorMessage);
      alert(errorMessage);
      setShowDeleteModal(false); // Tutup modal meskipun gagal
    }
  };

  useEffect(() => {
    let timer;
    if (showSuccessPopup) {
      timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

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
        Loading data stakeholder...
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
        Data stakeholder tidak ditemukan.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "70px 50px 12px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            flex: 1,
          }}
        >
          {/* Left Panel */}
          <div
            style={{
              background: 'url("/images/bgr.png")',
              backgroundSize: "cover",
              borderRadius: 24,
              padding: 20,
              color: "black",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src="/icons/profile.png"
                  alt="profile"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    padding: 10,
                  }}
                />
                <div>
                  <h2
                    style={{
                      fontSize: 34,
                      fontWeight: "bold",
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {stakeholder.name}
                  </h2>
                  <p
                    style={{
                      fontSize: 16,
                      color: "white",
                      margin: "4px 0 0 0",
                      textAlign: "left",
                    }}
                  >
                    {stakeholder.role?.name}
                  </p>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <button
                  onClick={toggleMenu}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 26,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ⋯
                </button>

                {showMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: 35,
                      right: 0,
                      backgroundColor: "white",
                      color: "#374151",
                      borderRadius: 8,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                      zIndex: 10,
                      overflow: "hidden",
                      minWidth: 160,
                    }}
                  >
                    {/* Edit */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #e5e7eb",
                        fontWeight: "500",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          "Edit clicked for stakeholder:",
                          stakeholder
                        );
                        handleEditClick();
                      }}
                    >
                      <FaEdit size={20} color="#3B82F6" />
                      Edit
                    </div>

                    {/* Delete */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 15px",
                        cursor: "pointer",
                        color: "#dc2626",
                        fontWeight: "500",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick();
                      }}
                    >
                      <FaTrash size={20} />
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
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
                      borderRadius: 16,
                      padding: "15px 28px",
                      fontWeight: "bold",
                      color: "#1E3A8A",
                      textAlign: "left",
                    }}
                  >
                    {label}:{" "}
                    {label === "Location"
                      ? stakeholder.location?.city || "[Lokasi]"
                      : stakeholder.contact || "-"}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: 3,
                borderRadius: 16,
                background: "linear-gradient(to right, #6C6DCB, #204C92)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "bold" }}>Stakeholder Type:</div>
                <div
                  style={{
                    backgroundColor: "#E9F7DF",
                    boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                    color: "#065f46",
                    padding: "5px 20px",
                    borderRadius: 12,
                    width: 180,
                    textAlign: "center",
                  }}
                >
                  {stakeholder.stakeholderType?.name || "-"}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 3,
                marginBottom: 33,
                borderRadius: 16,
                background: "linear-gradient(to right, #6C6DCB, #204C92)",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "bold" }}>Engagement Category:</div>
                <div
                  style={{
                    backgroundColor: "#D2E3EB",
                    boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                    color: "#374151",
                    padding: "5px 20px",
                    borderRadius: 12,
                    width: 180,
                    textAlign: "center",
                  }}
                >
                  {stakeholder.engagementCategory}
                </div>
              </div>
            </div>

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
                  WebkitBackdropFilter: "blur(10px)",
                  padding: 16,
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#ffffff" }}>
                  Database Status:
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(to right, #98BFE1 0%, #7C9BCC 100%)",
                    boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                    color: "#374151",
                    backgroundBlendMode: "plus-lighter",
                    padding: "7px 86px",
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
          </div>

          {/* Right Panel */}
          <div
            style={{
              background: 'url("/images/backgroundright.png")',
              backgroundSize: "cover",
              borderRadius: 24,
              padding: 20,
              color: "white",
            }}
          >
            {[
                { label: "Engagement Strategy", value: stakeholder.calculatedEngagementStrategy || "-", valueStyle: getIntensityStyle(stakeholder.calculatedEngagementStrategy), hasInfo: true, infoText: "Quadrant-based engagement strategy derived from influence and interest levels", noBadgeWrapper: true },
                { label: "Influence", value: stakeholder.influenceLevel ? stakeholder.influenceLevel.charAt(0).toUpperCase() + stakeholder.influenceLevel.slice(1) : "-" },
                { label: "Interest", value: stakeholder.interestLevel ? stakeholder.interestLevel.charAt(0).toUpperCase() + stakeholder.interestLevel.slice(1) : "-" },
                { label: "Engagement Intensity", value: stakeholder.engagementIntensity ? stakeholder.engagementIntensity.charAt(0).toUpperCase() + stakeholder.engagementIntensity.slice(1) : (stakeholder.calculatedEngagementStrategy || "-"), valueStyle: getIntensityStyle(stakeholder.engagementIntensity || stakeholder.calculatedEngagementStrategy), hasInfo: true, infoText: "Level of engagement effort required based on stakeholder priority", noBadgeWrapper: true },
                { label: "Risk Level", value: stakeholder.riskLevel ? stakeholder.riskLevel.charAt(0).toUpperCase() + stakeholder.riskLevel.slice(1) : "-" },
                { label: "Opportunity", value: stakeholder.opportunityLevel ? stakeholder.opportunityLevel.charAt(0).toUpperCase() + stakeholder.opportunityLevel.slice(1) : "-" },
                { label: "Benefit", value: stakeholder.benefitLevel ? stakeholder.benefitLevel.charAt(0).toUpperCase() + stakeholder.benefitLevel.slice(1) : "-" },
              ].map(({ label, value, valueStyle, hasInfo, infoText, noBadgeWrapper }) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 6, marginTop: 6 }}>
                  {noBadgeWrapper ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", whiteSpace: "nowrap", paddingLeft: 4 }}>
                      {label}{" "}
                      {hasInfo && (
                        <span
                          title={infoText}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 15,
                            height: 15,
                            borderRadius: "50%",
                            backgroundColor: "transparent",
                            border: "1.5px solid white",
                            color: "white",
                            fontSize: 10,
                            fontWeight: "bold",
                            cursor: "pointer",
                            verticalAlign: "middle",
                            marginLeft: 4,
                          }}
                        >
                          i
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ flex: 1, padding: 3, borderRadius: 16, background: "linear-gradient(to right, #6C6DCB, #204C92)" }}>
                      <div style={{ backgroundColor: "#ffffff", color: "#1e293b", padding: "8px 16px", borderRadius: 12, fontWeight: "bold", whiteSpace: "nowrap" }}>
                        {label}:
                      </div>
                    </div>
                  )}
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


            <div style={{ marginTop: 20 }}>
              <h3
                style={{
                  fontSize: 25,
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
                  "[Rekomendasi Utama]",
                  stakeholder.finalRecommendations
                    ?.engagementPriorityDescription || "[Detail Rekomendasi]",
                ].map((text, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.3)",
                      mixBlendMode: "normal",
                      backgroundBlendMode: "plus-lighter",
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      backdropFilter: "blur(20px)",
                      padding: 10,
                      borderRadius: 16,
                      flex: 1,
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 8,
            marginBottom: 8,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => navigate(`/deep-analysist/${id}`)}
            style={{
              background: "linear-gradient(to right, #3375C1, #81B4D6, #9FC8E3)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: "bold" }}>NEXT</span>
              <img src="/icons/next.png" alt="next" style={{ width: 36, height: 28 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: "normal", opacity: 0.9 }}>
              Mitigation plan based on key concern
            </span>
          </button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        stakeholderName={stakeholder?.name}
      />

      {showEditForm && stakeholder && (
        <EditStakeholderModal
          isOpen={showEditForm}
          onClose={handleCloseEditForm}
          onSubmit={handleSaveEditForm}
          formData={stakeholder}
          userRole={currentUserRole}
          roles={roles}
          stakeholderTypes={stakeholderTypes}
          locations={locations}
          strategies={strategies}
          frequencies={frequencies}
        />
      )}

      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            color: "#333",
            padding: "25px 35px",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            zIndex: 1001,
            fontSize: "18px",
            fontWeight: "600",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            border: "1px solid #e0e0e0",
            animation: "fadeInPopUp 0.4s ease-out forwards",
            maxWidth: "400px",
          }}
        >
          <img
            src="/icons/success_check.png"
            alt="Success"
            style={{ width: 40, height: 40 }}
          />
          {currentUserRole !== "bpma" ? (
            <>
              {selectedStakeholder
                ? "Permintaan hapus stakeholder berhasil disubmit!"
                : "Change request berhasil disubmit!"}
              <br />
              <small style={{ fontSize: "14px", color: "#666" }}>
                Status: {validationStatus || "Pending Review"}
              </small>
            </>
          ) : (
            <>
              {selectedStakeholder
                ? "Stakeholder berhasil dihapus!"
                : "Data stakeholder berhasil diperbarui!"}
              <br />
              <small style={{ fontSize: "14px", color: "#666" }}>
                {selectedStakeholder
                  ? "Mengalihkan ke daftar stakeholder..."
                  : `Status: ${getCurrentStatus()}`}
              </small>
            </>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes fadeInPopUp {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
          @keyframes fadeOutPopUp {
            from { opacity: 1; transform: translate(-50%, -50%); }
            to { opacity: 0; transform: translate(-50%, -40%); }
          }
        `}
      </style>
    </>
  );
}
