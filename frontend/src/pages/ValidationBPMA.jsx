import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaEye, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import "./ValidationBPMA.css";

const ValidationBPMA = () => {
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
        "/api/stakeholder-change-requests",
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

  const handleApprove = async (requestId) => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui perubahan ini?")) {
      return;
    }
    await updateRequestStatus(requestId, "Approved");
  };

  const handleReject = async (requestId) => {
    const reason = window.prompt("Berikan alasan penolakan:");
    if (!reason) return;
    await updateRequestStatus(requestId, "Rejected", reason);
  };

  const updateRequestStatus = async (requestId, status, reason = "") => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `/api/stakeholder-change-requests/${requestId}/review`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, reviewNote: reason }),
        }
      );

      if (res.ok) {
        alert(
          `Change request berhasil ${
            status === "Approved" ? "disetujui" : "ditolak"
          }!`
        );
        // Reload data requests
        await fetchPendingRequests();

        // Jika ada detail request yang sedang dibuka, tutup saja
        setShowDetailModal(false);
      } else {
        const errorData = await res.json();
        alert(
          `Gagal ${status === "Approved" ? "menyetujui" : "menolak"}: ${
            errorData.message
          }`
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Gagal memproses change request");
    }
  };

  const showDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
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

  // Fungsi untuk membandingkan data dan merender baris
  const renderComparisonRow = (label, oldData, newData) => {
    // Dapatkan nilai display string untuk oldData dan newData
    const oldValue =
      typeof oldData === "object" && oldData !== null
        ? oldData.name || JSON.stringify(oldData)
        : oldData ?? "-";

    const newValue =
      typeof newData === "object" && newData !== null
        ? newData.name || JSON.stringify(newData)
        : newData;

    // Cek perubahan dengan lebih ketat:
    const isChanged =
      newData !== undefined && newData !== null && newValue !== oldValue;

    return (
      <p>
        <strong>{label}:</strong>{" "}
        <span className={isChanged ? "changed" : ""}>{oldValue}</span>
        {isChanged && (
          <>
            {" "}
            → <span className="new-value">{newValue || "-"}</span>
          </>
        )}
      </p>
    );
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
              Validation Stakeholder Changes - BPMA
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
                  No Pending Requests
                </h3>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  Semua perubahan telah divalidasi.
                </p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#6B7280", fontWeight: "600", width: "25%" }}>Stakeholder</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#6B7280", fontWeight: "600", width: "20%" }}>KKKS</th>
                    <th style={{ padding: "14px 16px", textAlign: "center", color: "#6B7280", fontWeight: "600", width: "15%" }}>Status</th>
                    <th style={{ padding: "14px 16px", textAlign: "center", color: "#6B7280", fontWeight: "600", width: "20%" }}>Tanggal Pengajuan</th>
                    <th style={{ padding: "14px 16px", textAlign: "center", color: "#6B7280", fontWeight: "600", width: "20%" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "left" }}>
                        {req.stakeholderId?.name || req.stakeholderId?._id || "-"}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "left" }}>
                        {req.requestedBy?.name || req.requestedBy?.email || "-"}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "center" }}>
                        {getStatusBadge(req.status)}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "center" }}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={() => showDetail(req)}
                          style={{
                            padding: "8px 12px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#E0F2FE",
                            color: "#0B5394",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <FaEye /> Detail
                        </button>
                        <button
                          onClick={() => handleApprove(req._id)}
                          style={{
                            padding: "8px 12px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#D1FAE5",
                            color: "#047857",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <FaCheck /> Setujui
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          style={{
                            padding: "8px 12px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#FEE2E2",
                            color: "#DC2626",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <FaTimes /> Tolak
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Detail Permintaan</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              {/* Logika kondisional yang sudah benar */}
              {selectedRequest.isDeletionRequest ? (
                // Tampilan untuk Permintaan Penghapusan
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold mb-4 text-red-600">
                    Permintaan Penghapusan Stakeholder
                  </h3>
                  <p className="text-lg text-gray-700">
                    <strong>{selectedRequest.stakeholderId?.name}</strong>{" "}
                    diajukan untuk dihapus oleh{" "}
                    <strong>{selectedRequest.requestedBy?.name}</strong>.
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    Data stakeholder ini akan dihapus permanen dari sistem jika
                    permintaan ini disetujui.
                  </p>
                </div>
              ) : (
                // Tampilan untuk Permintaan Perubahan Data
                <div className="comparison-container">
                  <div className="column">
                    <h3>Data Saat Ini</h3>
                    <div className="card">
                      <p>
                        <strong>Nama:</strong>{" "}
                        {selectedRequest.stakeholderId?.name || "-"}
                      </p>
                      <p>
                        <strong>Role:</strong>{" "}
                        {selectedRequest.stakeholderId?.role?.name || "-"}
                      </p>
                      <p>
                        <strong>Tipe Stakeholder:</strong>{" "}
                        {selectedRequest.stakeholderId?.stakeholderType?.name ||
                          "-"}
                      </p>
                      <p>
                        <strong>Kategori Engagement:</strong>{" "}
                        {selectedRequest.stakeholderId?.engagementCategory ||
                          "-"}
                      </p>
                      <p>
                        <strong>Lokasi:</strong>{" "}
                        {selectedRequest.stakeholderId?.location?.city || "-"} -{" "}
                        {selectedRequest.stakeholderId?.location?.province
                          ?.name || "-"}
                      </p>
                      <p>
                        <strong>Kontak:</strong>{" "}
                        {selectedRequest.stakeholderId?.contact || "-"}
                      </p>
                      <p>
                        <strong>Frekuensi Engagement:</strong>{" "}
                        {selectedRequest.stakeholderId?.engagementFrequency
                          ?.name || "-"}
                      </p>
                      <p>
                        <strong>Strategi Engagement:</strong>{" "}
                        {selectedRequest.stakeholderId?.engagementStrategy
                          ?.strategy || "-"}
                      </p>
                      <p>
                        <strong>Focal Point:</strong>{" "}
                        {selectedRequest.stakeholderId?.focalPoints
                          ?.recommendedFocalpoint || "-"}
                      </p>
                      <p>
                        <strong>Tingkat Pengaruh:</strong>{" "}
                        {selectedRequest.stakeholderId?.influence ? selectedRequest.stakeholderId.influence.charAt(0).toUpperCase() + selectedRequest.stakeholderId.influence.slice(1) : "-"}
                      </p>
                      <p>
                        <strong>Tingkat Minat:</strong>{" "}
                        {selectedRequest.stakeholderId?.interest ? selectedRequest.stakeholderId.interest.charAt(0).toUpperCase() + selectedRequest.stakeholderId.interest.slice(1) : "-"}
                      </p>
                      <p>
                        <strong>Tingkat Risiko:</strong>{" "}
                        {selectedRequest.stakeholderId?.riskLevel ? selectedRequest.stakeholderId.riskLevel.charAt(0).toUpperCase() + selectedRequest.stakeholderId.riskLevel.slice(1) : "-"}
                      </p>
                      <p>
                        <strong>Tingkat Peluang:</strong>{" "}
                        {selectedRequest.stakeholderId?.opportunity ? selectedRequest.stakeholderId.opportunity.charAt(0).toUpperCase() + selectedRequest.stakeholderId.opportunity.slice(1) : "-"}
                      </p>
                      <p>
                        <strong>Tingkat Manfaat:</strong>{" "}
                        {selectedRequest.stakeholderId?.benefit ? selectedRequest.stakeholderId.benefit.charAt(0).toUpperCase() + selectedRequest.stakeholderId.benefit.slice(1) : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="column">
                    <h3>Perubahan Diajukan</h3>
                    <div className="card">
                      {renderComparisonRow(
                        "Nama",
                        selectedRequest.stakeholderId?.name,
                        selectedRequest.changeData?.name
                      )}
                      {renderComparisonRow(
                        "Role",
                        selectedRequest.stakeholderId?.role?.name,
                        selectedRequest.changeData?.role?.name
                      )}
                      {renderComparisonRow(
                        "Tipe Stakeholder",
                        selectedRequest.stakeholderId?.stakeholderType?.name,
                        selectedRequest.changeData?.stakeholderType?.name
                      )}
                      {renderComparisonRow(
                        "Kategori Engagement",
                        selectedRequest.stakeholderId?.engagementCategory,
                        selectedRequest.changeData?.engagementCategory
                      )}
                      {renderComparisonRow(
                        "Lokasi",
                        selectedRequest.stakeholderId?.location?.city,
                        selectedRequest.changeData?.location?.city
                      )}
                      {renderComparisonRow(
                        "Kontak",
                        selectedRequest.stakeholderId?.contact,
                        selectedRequest.changeData?.contact
                      )}
                      {renderComparisonRow(
                        "Frekuensi Engagement",
                        selectedRequest.stakeholderId?.engagementFrequency
                          ?.name,
                        selectedRequest.changeData?.engagementFrequency?.name
                      )}
                      {renderComparisonRow(
                        "Strategi Engagement",
                        selectedRequest.stakeholderId?.engagementStrategy
                          ?.strategy,
                        selectedRequest.changeData?.engagementStrategy?.strategy
                      )}
                      {renderComparisonRow(
                        "Focal Point",
                        selectedRequest.stakeholderId?.focalPoints
                          ?.recommendedFocalpoint,
                        selectedRequest.changeData?.focalPoints
                          ?.recommendedFocalpoint
                      )}
                      {renderComparisonRow(
                        "Tingkat Pengaruh",
                        cap(selectedRequest.stakeholderId?.influence),
                        cap(selectedRequest.changeData?.influence)
                      )}
                      {renderComparisonRow(
                        "Tingkat Minat",
                        cap(selectedRequest.stakeholderId?.interest),
                        cap(selectedRequest.changeData?.interest)
                      )}
                      {renderComparisonRow(
                        "Tingkat Risiko",
                        cap(selectedRequest.stakeholderId?.riskLevel),
                        cap(selectedRequest.changeData?.riskLevel)
                      )}
                      {renderComparisonRow(
                        "Tingkat Peluang",
                        cap(selectedRequest.stakeholderId?.opportunity),
                        cap(selectedRequest.changeData?.opportunity)
                      )}
                      {renderComparisonRow(
                        "Tingkat Manfaat",
                        cap(selectedRequest.stakeholderId?.benefit),
                        cap(selectedRequest.changeData?.benefit)
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => handleApprove(selectedRequest._id)}
                style={{ backgroundColor: "#047857", color: "white" }}
              >
                <FaCheck /> Approved
              </button>
              <button
                onClick={() => handleReject(selectedRequest._id)}
                style={{ backgroundColor: "#DC2626", color: "white" }}
              >
                <FaTimes /> Rejected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ValidationBPMA;
