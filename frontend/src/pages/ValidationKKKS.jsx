import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import Navbar from "../components/Navbar";
import { FaEye, FaClock, FaCheck, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ValidationKKKS = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/stakeholder-change-requests/my-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch change requests");
      }
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch change requests:", error);
      alert("Gagal mengambil data change request");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Apakah Anda yakin ingin menghapus validation ini?")) {
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/stakeholder-change-requests/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete validation request");
      }
      alert("Validation request berhasil dihapus");
      fetchPendingRequests(); // refresh data setelah hapus
    } catch (error) {
      console.error("Failed to delete validation request:", error);
      alert("Gagal menghapus validation request");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: { bg: "#FEF3C7", color: "#92400E", text: "Pending" },
      Approved: { bg: "#D1FAE5", color: "#047857", text: "Approved" },
      Rejected: { bg: "#FEE2E2", color: "#DC2626", text: "Rejected" },
    };
    const style = styles[status] || styles.Pending;

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {style.text}
      </span>
    );
  };

  const cap = (val) => (val && typeof val === 'string' ? val.charAt(0).toUpperCase() + val.slice(1) : val);

  const renderComparisonRow = (label, oldData, newData) => {
    const getDisplayValue = (data) => {
      if (typeof data === "object" && data !== null) {
        return data.name || JSON.stringify(data);
      }
      return data ?? "-";
    };

    const oldValue = getDisplayValue(oldData);
    const newValue = getDisplayValue(newData);

    const isChanged =
      newValue !== oldValue && newValue !== "-" && newValue !== "";

    return (
      <p>
        <strong>{label}:</strong> <span>{oldValue}</span>
        {isChanged && (
          <>
            {" "}
            → <span>{newValue}</span>
          </>
        )}
      </p>
    );
  };

  const showDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            paddingTop: "80px",
          }}
        >
          Loading validation requests...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          padding: "100px 50px 50px 50px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #3B82F6, #1D4ED8)",
              color: "white",
              padding: "20px 30px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaClock size={24} />
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
              My Change Request History
            </h2>
          </div>
          <div style={{ padding: "30px" }}>
            {requests.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#6B7280",
                }}
              >
                <FaCheck
                  size={48}
                  style={{ marginBottom: "16px", opacity: 0.3 }}
                />
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                  No Change Requests Submitted
                </h3>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  Anda belum mengajukan perubahan stakeholder.
                </p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th
                      style={{
                        width: "30%",
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#6B7280",
                        fontWeight: "600",
                      }}
                    >
                      Stakeholder
                    </th>
                    <th
                      style={{
                        width: "25%",
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#6B7280",
                        fontWeight: "600",
                      }}
                    >
                      Change Submitted On
                    </th>
                    <th
                      style={{
                        width: "20%",
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#6B7280",
                        fontWeight: "600",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        width: "25%",
                        padding: "14px 16px",
                        textAlign: "center",
                        color: "#6B7280",
                        fontWeight: "600",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      style={{ borderBottom: "1px solid #E5E7EB" }}
                    >
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "left" }}>
                        {req.stakeholderId?._id ? (
                          <Link
                            to={`/engagement-priority/${req.stakeholderId._id}`}
                            style={{ color: "#3B82F6", fontWeight: "600" }}
                          >
                            {req.stakeholderId.name}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "left" }}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "left" }}>
                        {getStatusBadge(req.status)}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button
                            onClick={() => showDetail(req)}
                            style={{
                              backgroundColor: "#3B82F6",
                              color: "white",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            aria-label={`Show detail for request ${req._id}`}
                          >
                            <FaEye /> Detail
                          </button>
                          <button
                            onClick={() => handleDelete(req._id)}
                            style={{
                              backgroundColor: "#DC2626",
                              color: "white",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            aria-label={`Delete request ${req._id}`}
                          >
                            <FaTrash /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detail Perubahan */}
      {showDetailModal && selectedRequest && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              maxWidth: 650,
              width: "100%",
              padding: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowDetailModal(false)}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 24,
                color: "#6B7280",
              }}
            >
              &times;
            </button>
            <h2 style={{ marginTop: 0, fontWeight: "bold", fontSize: 22 }}>
              Detail Perubahan Data
            </h2>

            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    padding: 16,
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                  }}
                >
                  {renderComparisonRow(
                    "Nama",
                    selectedRequest.stakeholderId.name,
                    selectedRequest.changeData.name
                  )}
                  {renderComparisonRow(
                    "Role",
                    selectedRequest.stakeholderId?.role?.name,
                    selectedRequest.changeData.role?.name
                  )}
                  {renderComparisonRow(
                    "Tipe Stakeholder",
                    selectedRequest.stakeholderId?.stakeholderType?.name,
                    selectedRequest.changeData.stakeholderType?.name
                  )}
                  {renderComparisonRow(
                    "Kategori Engagement",
                    selectedRequest.stakeholderId.engagementCategory,
                    selectedRequest.changeData.engagementCategory
                  )}
                  {renderComparisonRow(
                    "Lokasi",
                    selectedRequest.stakeholderId.location?.city,
                    selectedRequest.changeData.location?.city
                  )}
                  {renderComparisonRow(
                    "Kontak",
                    selectedRequest.stakeholderId.contact,
                    selectedRequest.changeData.contact
                  )}
                  {renderComparisonRow(
                    "Frekuensi Engagement",
                    selectedRequest.stakeholderId.engagementFrequency?.name,
                    selectedRequest.changeData.engagementFrequency?.name
                  )}
                  {renderComparisonRow(
                    "Strategi Engagement",
                    selectedRequest.stakeholderId.engagementStrategy?.strategy,
                    selectedRequest.changeData.engagementStrategy?.strategy
                  )}
                  {renderComparisonRow(
                    "Focal Point",
                    selectedRequest.stakeholderId.focalPoints
                      ?.recommendedFocalpoint,
                    selectedRequest.changeData.focalPoints
                      ?.recommendedFocalpoint
                  )}
                  {renderComparisonRow(
                    "Tingkat Pengaruh",
                    cap(selectedRequest.stakeholderId.influence),
                    cap(selectedRequest.changeData.influence)
                  )}
                  {renderComparisonRow(
                    "Tingkat Minat",
                    cap(selectedRequest.stakeholderId.interest),
                    cap(selectedRequest.changeData.interest)
                  )}
                  {renderComparisonRow(
                    "Tingkat Risiko",
                    cap(selectedRequest.stakeholderId.riskLevel),
                    cap(selectedRequest.changeData.riskLevel)
                  )}
                  {renderComparisonRow(
                    "Tingkat Peluang",
                    cap(selectedRequest.stakeholderId.opportunity),
                    cap(selectedRequest.changeData.opportunity)
                  )}
                  {renderComparisonRow(
                    "Tingkat Manfaat",
                    cap(selectedRequest.stakeholderId.benefit),
                    cap(selectedRequest.changeData.benefit)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ValidationKKKS;
