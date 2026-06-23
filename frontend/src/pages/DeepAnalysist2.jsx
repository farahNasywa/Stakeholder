import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

// IMPORT SERVICE YANG SUDAH DIPISAH
import { calculateCompleteReengagementAnalysis } from "../services/reengagementCalculationService.js";

export default function DeepAnalysist2() {
  const { id: stakeholderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { recommendationData } = location.state || {};

  const [stakeholderData, setStakeholderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoMessage] = useState(null);

  // State untuk validation status (seperti di Deep Analysis 1)
  const [validationStatus, setValidationStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // State untuk flag re-engagement. Gunakan `null` untuk merepresentasikan status 'belum dipilih'.
  const [reengagementFlags, setReengagementFlags] = useState({
    issueEscalation: null,
    projectMilestoneImpact: null,
    stakeholderRequest: null,
    regulatoryChangeAlert: null,
    mediaCoverageAlert: null,
    communityFeedbackReceived: null,
  });

  const [reengagementStatus, setReengagementStatus] = useState("");
  const [reengagementReason, setReengagementReason] = useState("");
  const [areAllFlagsSelected, setAreAllFlagsSelected] = useState(false);

  // Function untuk fetch validation status (dengan mapping status yang benar)
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
        // Normalisasi status agar sesuai dengan enum backend
        let normalizedStatus = data.status;
        
        // Mapping status yang mungkin bermasalah (case sensitivity):
        if (data.status === 'Approved') {
          normalizedStatus = 'Approved'; // sesuai enum: "Approved"
        }
        if (data.status === 'Rejected') {
          normalizedStatus = 'Rejected'; // sesuai enum: "Rejected"
        }
        if (data.status === 'Pending') {
          normalizedStatus = 'Pending'; // sesuai enum: "Pending"
        }
        if (data.status === 'Approved') {
          normalizedStatus = 'Approved'; // sesuai enum: "Approved"
        }
        
        setValidationStatus(normalizedStatus ?? null);
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

  // Helper functions untuk status management (sama seperti di Deep Analysis 1)
  const getCurrentStatus = () => {
    // Prioritas: validation status (dari change request) > stakeholder status
    if (validationStatus && validationStatus !== stakeholderData?.status) {
      return validationStatus;
    }
    return stakeholderData?.status || "Unknown";
  };

  const getStatusDisplay = () => {
    if (statusLoading) {
      return "Loading...";
    }
    return getCurrentStatus();
  };

  // Function untuk refresh stakeholder data (sama seperti di Deep Analysis 1)
  const refreshStakeholderData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/stakeholders/${stakeholderId}`
      );
      setStakeholderData(response.data);
      
      // Refresh validation status juga
      await fetchValidationStatus(stakeholderId);

      // Selalu reset flags agar user mengisi ulang untuk kondisi terkini
      // Ini memastikan evaluasi ulang terhadap situasi stakeholder
      if (response.data.reengagementTriggers && response.data.reengagementTriggers.flags) {
        // Meskipun ada data tersimpan, tetap reset agar user evaluasi ulang
        setReengagementFlags({
          issueEscalation: null,
          projectMilestoneImpact: null,
          stakeholderRequest: null,
          regulatoryChangeAlert: null,
          mediaCoverageAlert: null,
          communityFeedbackReceived: null,
        });
        setReengagementStatus("");
        setReengagementReason("");
        setAreAllFlagsSelected(false);
      }
    } catch (error) {
      console.error("Gagal mengambil data stakeholder:", error);
    }
  }, [stakeholderId, fetchValidationStatus]);

  // Effect untuk mengambil data stakeholder dari API
  const fetchStakeholder = useCallback(async () => {
    try {
      setLoading(true);
      if (stakeholderId) {
        const res = await axios.get(
          `/api/stakeholders/${stakeholderId}`
        );
        const data = res.data;
        setStakeholderData(data);
        
        // Fetch validation status
        await fetchValidationStatus(stakeholderId);
        
        // Selalu mulai dengan flags kosong (null) dan biarkan user mengisi ulang
        // Ini memastikan user selalu mengecek ulang kondisi terkini
        setReengagementFlags({
          issueEscalation: null,
          projectMilestoneImpact: null,
          stakeholderRequest: null,
          regulatoryChangeAlert: null,
          mediaCoverageAlert: null,
          communityFeedbackReceived: null,
        });
        setAreAllFlagsSelected(false);
        setReengagementStatus("");
        setReengagementReason("");
      }
    } catch (err) {
      setError(
        "Gagal memuat data stakeholder. Pastikan server API berjalan di ."
      );
    } finally {
      setLoading(false);
    }
  }, [stakeholderId, fetchValidationStatus]);

  // useEffect untuk auto-refresh data ketika kembali ke halaman ini (sama seperti di Deep Analysis 1)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && stakeholderId) {
        refreshStakeholderData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [stakeholderId, refreshStakeholderData]);

  useEffect(() => {
    fetchStakeholder();
  }, [fetchStakeholder]);

  // Fetch validation status when stakeholder is loaded (sama seperti di Deep Analysis 1)
  useEffect(() => {
    const fetchValidationStatusForStakeholder = async () => {
      if (!stakeholderData || !stakeholderData._id) return;

      try {
        setStatusLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/stakeholder-change-requests/latest-status?stakeholderId=${stakeholderData._id}`,
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
  }, [stakeholderData]);

  // Fungsi untuk menangani perubahan pada radio button
  const handleFlagChange = async (flagKey, value) => {
    // Update state flags
    const newFlags = { ...reengagementFlags, [flagKey]: value };
    setReengagementFlags(newFlags);

    // Cek apakah semua flag telah dipilih (bukan null)
    const allFlagsSelected = Object.values(newFlags).every(
      (val) => val !== null
    );
    setAreAllFlagsSelected(allFlagsSelected);

    // Hanya lakukan kalkulasi dan update backend jika semua flag telah dipilih
    if (allFlagsSelected) {
      try {
        // Lakukan kalkulasi terlebih dahulu
        const analysis = calculateCompleteReengagementAnalysis(newFlags);

        // Update state UI terlebih dahulu agar user langsung melihat hasil
        setReengagementStatus(analysis.status);
        setReengagementReason(analysis.reason);

        // Kemudian update backend dengan mapping status yang benar
        const updateData = {
          reengagementTriggers: {
            flags: newFlags,
            score: analysis.score,
            status: analysis.status,
            reasons: analysis.reason,
          },
          updatedBy: "user",
        };

        // Jika ada status field, pastikan menggunakan enum yang benar
        if (updateData.status) {
          if (updateData.status === 'valid') {
            updateData.status = 'approved'; // sesuaikan dengan enum
          }
          if (updateData.status === 'rejected') {
            updateData.status = 'declined'; // sesuaikan dengan enum
          }
        }

        await axios.put(
          `/api/stakeholders/${stakeholderId}`,
          updateData
        );

        // Perbarui state stakeholderData setelah berhasil diupdate di backend
        const updatedStakeholderData = {
          ...stakeholderData,
          reengagementTriggers: {
            flags: newFlags,
            score: analysis.score,
            status: analysis.status,
            reasons: analysis.reason,
          },
        };
        setStakeholderData(updatedStakeholderData);
      } catch (err) {
        // Jika error di kalkulasi, reset UI
        if (err.message && !err.response) {
          setReengagementStatus("Error dalam perhitungan");
          setReengagementReason(
            "Terjadi kesalahan dalam perhitungan: " + err.message
          );
          setError("Error dalam perhitungan: " + err.message);
        } else {
          // Jika error di backend tapi kalkulasi berhasil, tetap tampilkan hasil
          setError(
            "Hasil sudah ditampilkan, tapi gagal simpan ke database: " +
              (err.response?.data?.message || err.message)
          );
        }
      }
    } else {
      // Jika belum semua flag dipilih, reset status dan alasan
      setReengagementStatus("");
      setReengagementReason("");
    }
  };

  // Helper function untuk format location (sama seperti di Deep Analysis 1)
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

  // Komponen untuk styling
  const GlassCard = ({ children, style }) => (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        padding: 20,
        borderRadius: 15,
        border: "1px solid rgba(255,255,255,0.3)",
        ...style,
      }}
    >
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h4
      style={{
        fontSize: 20,
        background: "linear-gradient(to bottom, #8DC8FF, #6B9EFF)",
        padding: "8px 16px",
        borderRadius: 12,
        fontWeight: "bold",
        margin: "0 0 10px 0",
        color: "#000",
        textAlign: "center",
      }}
    >
      {children}
    </h4>
  );

  const CardContent = ({ children, style }) => (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        color: "#000",
        padding: 15,
        borderRadius: 10,
        fontWeight: "600",
        whiteSpace: "pre-line",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          fontSize: "20px",
          color: "#374151",
        }}
      >
        Loading stakeholder data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          fontSize: "20px",
          color: "red",
        }}
      >
        ⚠️ Error: {error}
      </div>
    );
  }

  if (!recommendationData) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          fontSize: "20px",
          color: "red",
        }}
      >
        ⚠️ Data rekomendasi tidak ditemukan. Silakan kembali ke halaman
        sebelumnya dan pilih "Key Concern" lalu klik "Trigger".
      </div>
    );
  }

  const flagLabels = {
    "Issue Escalation Flag": "issueEscalation",
    "Project Milestone Impact": "projectMilestoneImpact",
    "Stakeholder Request": "stakeholderRequest",
    "Regulatory Change Alert": "regulatoryChangeAlert",
    "Media Coverage Alert": "mediaCoverageAlert",
    "Community Feedback Received": "communityFeedbackReceived",
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
        {infoMessage && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(52, 152, 219, 0.9)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              zIndex: 1000,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            {infoMessage}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: "90px 50px 30px",
            gap: "20px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
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
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <img
                    src="/icons/profile.png"
                    alt="profile"
                    style={{ width: 90, height: 90, borderRadius: "50%", flexShrink: 0 }}
                  />
                  <div>
                    <h2 style={{ fontSize: 26, fontWeight: "bold", color: "white", margin: "0 0 4px 0", textAlign: "left" }}>
                      {stakeholderData?.name || "N/A"}
                    </h2>
                    <p style={{ fontSize: 14, color: "white", margin: 0, opacity: 0.85, textAlign: "left" }}>
                      {stakeholderData?.role?.name || ""}
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
                        borderRadius: 16,
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
                        ? formatLocation(stakeholderData?.location)
                        : stakeholderData?.contact || "-"}
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
                      padding: "5px 12px",
                      borderRadius: 12,
                      width: 220,
                      textAlign: "center",
                    }}
                  >
                    {stakeholderData?.stakeholderType?.name || "N/A"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: 3,
                  marginBottom: 17,
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
                      padding: "5px 12px",
                      borderRadius: 12,
                      width: 220,
                      textAlign: "center",
                    }}
                  >
                    {stakeholderData?.engagementCategory || "N/A"}
                  </div>
                </div>
              </div>
              {/* Status dengan data terbaru */}
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
                    Status:
                  </div>
                  <div
                    style={{
                      backgroundColor: "#D2E3EB",
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      color: "#374151",
                      backgroundBlendMode: "plus-lighter",
                      padding: "5px 25px",
                      borderRadius: 12,
                      minWidth: 230,
                      textAlign: "center",
                      opacity: statusLoading ? 0.7 : 1,
                    }}
                  >
                    {getStatusDisplay()}
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Recommendation Section */}
            <div
              style={{
                background: 'url("/images/bgr.png")',
                backgroundSize: "cover",
                borderRadius: 20,
                padding: 19,
                color: "white",
              }}
            >
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 20px 0",
                }}
              >
                Previous Recommendation
              </h3>

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
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#1E3A8A",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    lineHeight: "1.5",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    {recommendationData?.keyConcern || "-"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 15,
                  marginBottom: 15,
                }}
              >
                <GlassCard>
                  <CardTitle>Mitigation Plan</CardTitle>
                  <CardContent style={{ minHeight: "50px", fontSize: 16 }}>
                    {recommendationData?.mitigationPlan || "-"}
                  </CardContent>
                </GlassCard>
                <GlassCard>
                  <CardTitle>Objective</CardTitle>
                  <CardContent style={{ minHeight: "50px", fontSize: 16 }}>
                    {recommendationData?.objective || "-"}
                  </CardContent>
                </GlassCard>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 15,
                }}
              >
                <GlassCard>
                  <CardTitle>Focal Point</CardTitle>
                  <CardContent
                    style={{
                      minHeight: "50px",
                      fontSize: 14,
                      textAlign: "left",
                    }}
                  >
                    {recommendationData?.focalPoint ||
                      stakeholderData?.focalPoints?.recommendedFocalpoint ||
                      "-"}
                  </CardContent>
                </GlassCard>
                <GlassCard>
                  <CardTitle>Back up</CardTitle>
                  <CardContent
                    style={{
                      minHeight: "50px",
                      fontSize: 14,
                      textAlign: "left",
                    }}
                  >
                    {recommendationData?.backUp ||
                      stakeholderData?.focalPoints?.backupSupportFocalpoint ||
                      "-"}
                  </CardContent>
                </GlassCard>
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
                gap: 20,
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: 22,
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "16px",
                  backgroundColor: "rgba(67, 137, 245, 0.2)",
                  backdropFilter: "blur(10px)",
                  top: "5px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-18px",
                    left: "20px",
                    background: "linear-gradient(to bottom, #256BAD, #0A172C)",
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: "12px",
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
                  }}
                >
                  {stakeholderData?.engagementStrategy?.strategy || recommendationData?.engagementStrategy || stakeholderData?.calculatedEngagementStrategy || "-"}
                </div>
              </div>

              <div
                style={{
                  margin: "5px 0",
                  padding: "20px 65px",
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
                    {recommendationData?.engagementFrequency ||
                      stakeholderData?.engagementFrequency?.name ||
                      "-"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.8)",
                      maxWidth: "250px",
                    }}
                  >
                    H-M/ Standard for local government, impacted communities,
                    and labor groups.
                  </div>
                </div>
              </div>

              {/* Re-engagement Flags Section */}
              <div
                style={{
                  padding: "5px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "16px",
                  backgroundColor: "rgba(67, 137, 245, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    color: "#333",
                  }}
                >
                  {Object.entries(flagLabels).map(
                    ([label, flagKey], idx, arr) => (
                      <div
                        key={flagKey}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 20px",
                          backgroundColor:
                            idx % 2 === 0 ? "#f7faff" : "#ffffff",
                          borderBottom:
                            idx !== arr.length - 1
                              ? "1px solid #e0e0e0"
                              : "none",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        <div>{label}</div>
                        <div style={{ display: "flex", gap: "15px" }}>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name={flagKey}
                              value="true"
                              checked={reengagementFlags[flagKey] === true}
                              onChange={() => handleFlagChange(flagKey, true)}
                            />
                            Yes
                          </label>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name={flagKey}
                              value="false"
                              checked={reengagementFlags[flagKey] === false}
                              onChange={() => handleFlagChange(flagKey, false)}
                            />
                            No
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            
            {/* Conditional Re-engagement Status Result */}
            {areAllFlagsSelected && (
              <div
                style={{
                  background: 'url("/images/bgpabrik.png")',
                  backgroundSize: "cover",
                  borderRadius: "20px",
                  padding: "20px",
                  color: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    padding: "16px 24px",
                    border: "1px solid white",
                    marginBottom: "30px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "18px", fontWeight: "600" }}>
                    Re-engagement Status:
                  </span>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "12px",
                      padding: "10px 50px",
                      fontSize: "16px",
                    }}
                  >
                    {reengagementStatus}
                  </div>
                </div>
                {reengagementReason && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-18px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: "#163E7D",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "20px",
                          borderRadius: "12px",
                          padding: "11px 24px",
                          textAlign: "center",
                          width: "calc(100% - 40px)",
                        }}
                      >
                        Trigger Reason
                      </div>
                      <div
                        style={{
                          padding: "40px 24px 24px 24px",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#000",
                          lineHeight: "1.6",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {reengagementReason}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 40px 32px" }}>
        <button
          onClick={() => navigate(`/stakeholderprofilesetup/${stakeholderId}`)}
          style={{
            background: "linear-gradient(to right, #3375C1, #81B4D6, #9FC8E3)",
            color: "white",
            padding: "12px 24px",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: "bold" }}>NEXT</span>
          <img src="/icons/next.png" alt="next" style={{ width: 36, height: 28 }} />
        </button>
      </div>
    </>
  );
}