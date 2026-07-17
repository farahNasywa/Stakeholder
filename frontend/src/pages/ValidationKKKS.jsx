import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { FaEye, FaClock, FaCheck, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ValidationKKKS = () => {
  const { t } = useTranslation();
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
      alert(t("validationKkks.fetchFailedAlert"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm(t("validationKkks.confirmDelete"))) {
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
      alert(t("validationKkks.deletedAlert"));
      fetchPendingRequests(); // refresh data setelah hapus
    } catch (error) {
      console.error("Failed to delete validation request:", error);
      alert(t("validationKkks.deleteFailedAlert"));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: { bg: "#FEF3C7", color: "#92400E", text: t("validationKkks.status.pending") },
      Approved: { bg: "#D1FAE5", color: "#047857", text: t("validationKkks.status.approved") },
      Rejected: { bg: "#FEE2E2", color: "#DC2626", text: t("validationKkks.status.rejected") },
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

  const getRequestTypeBadge = (req) => {
    const type = req.requestType || (req.isDeletionRequest ? "Delete" : "Edit");
    const styles = {
      Create: { bg: "#DBEAFE", color: "#1D4ED8", text: t("validationBpma.requestTypes.create") },
      Edit: { bg: "#FEF3C7", color: "#92400E", text: t("validationBpma.requestTypes.edit") },
      Delete: { bg: "#FEE2E2", color: "#DC2626", text: t("validationBpma.requestTypes.delete") },
    };
    const style = styles[type] || styles.Edit;
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
          {t("validationKkks.loadingText")}
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
              {t("validationKkks.headerTitle")}
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
                  {t("validationKkks.noRequestsTitle")}
                </h3>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  {t("validationKkks.noRequestsSubtitle")}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th
                      style={{
                        width: "25%",
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#6B7280",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("validationKkks.table.stakeholder")}
                    </th>
                    <th
                      style={{
                        width: "13%",
                        padding: "14px 16px",
                        textAlign: "center",
                        color: "#6B7280",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("validationKkks.table.requestType")}
                    </th>
                    <th
                      style={{
                        width: "17%",
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#6B7280",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("validationKkks.table.submittedOn")}
                    </th>
                    <th
                      style={{
                        width: "15%",
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#6B7280",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("validationKkks.table.status")}
                    </th>
                    <th
                      style={{
                        width: "30%",
                        padding: "14px 16px",
                        textAlign: "center",
                        color: "#6B7280",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("validationKkks.table.actions")}
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
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "center" }}>
                        {getRequestTypeBadge(req)}
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
                            <FaEye /> {t("validationKkks.buttons.detail")}
                          </button>
                          {req.status === "Pending" && (
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
                            <FaTrash /> {t("validationKkks.buttons.delete")}
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
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
              aria-label={t("validationKkks.modal.closeLabel")}
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
              {t("validationKkks.modal.title")}
            </h2>

            {selectedRequest.isDeletionRequest ? (
              <div style={{ textAlign: "center", padding: "24px 8px" }}>
                <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#DC2626" }}>
                  {t("validationKkks.deletionTitle")}
                </h3>
                <p style={{ fontSize: 16, color: "#374151" }}>
                  <strong>{selectedRequest.stakeholderId?.name || "-"}</strong>{" "}
                  {t("validationKkks.deletionText1")}
                </p>
                <p style={{ marginTop: 16, fontSize: 14, color: "#6B7280" }}>
                  {t("validationKkks.deletionText2")}
                </p>
              </div>
            ) : selectedRequest.requestType === "Create" ? (
              <div style={{ padding: "8px 4px" }}>
                <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#1D4ED8" }}>
                  {t("validationBpma.newStakeholderDataTitle")}
                </h3>
                <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                  <p><strong>{t("validationKkks.modal.fields.name")}:</strong> {selectedRequest.stakeholderId?.name || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.role")}:</strong> {selectedRequest.stakeholderId?.role?.name || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.stakeholderType")}:</strong> {selectedRequest.stakeholderId?.stakeholderType?.name || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.engagementCategory")}:</strong> {selectedRequest.stakeholderId?.engagementCategory || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.location")}:</strong> {selectedRequest.stakeholderId?.location?.city || "-"} - {selectedRequest.stakeholderId?.location?.province?.name || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.contact")}:</strong> {selectedRequest.stakeholderId?.contact || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.engagementFrequency")}:</strong> {selectedRequest.stakeholderId?.engagementFrequency?.name || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.engagementStrategy")}:</strong> {selectedRequest.stakeholderId?.engagementStrategy?.strategy || "-"}</p>
                  <p><strong>{t("validationKkks.modal.fields.influenceLevel")}:</strong> {cap(selectedRequest.stakeholderId?.influenceLevel)}</p>
                  <p><strong>{t("validationKkks.modal.fields.interestLevel")}:</strong> {cap(selectedRequest.stakeholderId?.interestLevel)}</p>
                  <p><strong>{t("validationKkks.modal.fields.riskLevel")}:</strong> {cap(selectedRequest.stakeholderId?.riskLevel)}</p>
                  <p><strong>{t("validationKkks.modal.fields.opportunityLevel")}:</strong> {cap(selectedRequest.stakeholderId?.opportunityLevel)}</p>
                  <p><strong>{t("validationKkks.modal.fields.benefitLevel")}:</strong> {cap(selectedRequest.stakeholderId?.benefitLevel)}</p>
                </div>
              </div>
            ) : (
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
                    t("validationKkks.modal.fields.name"),
                    selectedRequest.stakeholderId?.name,
                    selectedRequest.changeData?.name
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.role"),
                    selectedRequest.stakeholderId?.role?.name,
                    selectedRequest.changeData?.role?.name
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.stakeholderType"),
                    selectedRequest.stakeholderId?.stakeholderType?.name,
                    selectedRequest.changeData?.stakeholderType?.name
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.engagementCategory"),
                    selectedRequest.stakeholderId?.engagementCategory,
                    selectedRequest.changeData?.engagementCategory
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.location"),
                    selectedRequest.stakeholderId?.location?.city,
                    selectedRequest.changeData?.location?.city
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.contact"),
                    selectedRequest.stakeholderId?.contact,
                    selectedRequest.changeData?.contact
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.engagementFrequency"),
                    selectedRequest.stakeholderId?.engagementFrequency?.name,
                    selectedRequest.changeData?.engagementFrequency?.name
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.engagementStrategy"),
                    selectedRequest.stakeholderId?.engagementStrategy?.strategy,
                    selectedRequest.changeData?.engagementStrategy?.strategy
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.focalPoint"),
                    selectedRequest.stakeholderId?.focalPoints
                      ?.recommendedFocalpoint,
                    selectedRequest.changeData?.focalPoints
                      ?.recommendedFocalpoint
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.influenceLevel"),
                    cap(selectedRequest.stakeholderId?.influence),
                    cap(selectedRequest.changeData?.influence)
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.interestLevel"),
                    cap(selectedRequest.stakeholderId?.interest),
                    cap(selectedRequest.changeData?.interest)
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.riskLevel"),
                    cap(selectedRequest.stakeholderId?.riskLevel),
                    cap(selectedRequest.changeData?.riskLevel)
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.opportunityLevel"),
                    cap(selectedRequest.stakeholderId?.opportunity),
                    cap(selectedRequest.changeData?.opportunity)
                  )}
                  {renderComparisonRow(
                    t("validationKkks.modal.fields.benefitLevel"),
                    cap(selectedRequest.stakeholderId?.benefit),
                    cap(selectedRequest.changeData?.benefit)
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ValidationKKKS;
