import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function EngagementJustification() {
  const { id } = useParams();
  const [stakeholder, setStakeholder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatJustification = (text) => {
    if (!text) return [];
    return text
      .split(/\r?\n/)
      .map(line => line.replace(/^\s*\d+\.\s*/, "").trim())
      .filter(line =>
        line.length > 0 &&
        !/^Q\d+/i.test(line) &&
        !/^(Yes|No)$/i.test(line) &&
        !/Impacted by Project/i.test(line)
      );
  };

  useEffect(() => {
    const fetchStakeholderData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/stakeholders/${id}`);
        setStakeholder(response.data);
      } catch (err) {
        setError("Gagal memuat data stakeholder. Pastikan server API berjalan.");
        console.error("Error fetching stakeholder data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStakeholderData();
    } else {
      setError("ID Stakeholder tidak ditemukan di URL.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, color: "#374151" }}>
        <Navbar />
        Loading data stakeholder...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#dc2626", textAlign: "center", padding: 20 }}>
        <Navbar />
        <div>Error: {error}</div>
        <p style={{ fontSize: 14, marginTop: 8 }}>Pastikan server backend berjalan dan ID stakeholder valid.</p>
      </div>
    );
  }

  if (!stakeholder) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, color: "#374151" }}>
        <Navbar />
        Data stakeholder tidak ditemukan.
      </div>
    );
  }

  const cap = (val) => val ? val.charAt(0).toUpperCase() + val.slice(1) : '-';

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            padding: "85px 50px 30px",
            height: "100vh",
            boxSizing: "border-box",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <img
                src="/icons/profile.png"
                alt="profile"
                style={{ width: 100, height: 100, borderRadius: "50%", padding: 10, flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ fontSize: 28, fontWeight: "bold", color: "white", margin: 0, lineHeight: 1.2 }}>
                  {stakeholder.name}
                </h2>
                <p style={{ fontSize: 15, color: "white", margin: "6px 0 0 0", lineHeight: 1.3, textAlign: "left" }}>
                  {stakeholder.role?.name}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
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
                      padding: "12px 18px",
                      fontWeight: "bold",
                      color: "#1E3A8A",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>{label}</span>
                    <div style={{ marginTop: 2, color: "#1E3A8A", fontSize: 14 }}>
                      {label === "Location"
                        ? stakeholder.location?.city || stakeholder.location?.province?.name || "-"
                        : stakeholder.contact || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {[
              { label: "Stakeholder Type", value: stakeholder.stakeholderType?.name || "-", bg: "#E9F7DF", color: "#065f46" },
              { label: "Engagement Category", value: stakeholder.engagementCategory || "-", bg: "#D2E3EB", color: "#374151" },
              { label: "Influence Level", value: cap(stakeholder.influenceLevel), bg: "#EDE9FE", color: "#4C1D95" },
              { label: "Interest Level", value: cap(stakeholder.interestLevel), bg: "#FEF3C7", color: "#78350F" },
            ].map(({ label, value, bg, color }) => (
              <div
                key={label}
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
                    padding: "14px 20px",
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{label}:</div>
                  <div
                    style={{
                      backgroundColor: bg,
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      color,
                      padding: "5px 20px",
                      borderRadius: 12,
                      minWidth: 140,
                      textAlign: "center",
                    }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div
            style={{
              background: 'url("/images/backgroundright.png")',
              backgroundSize: "cover",
              borderRadius: 24,
              padding: 28,
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              Engagement Justification
              <img
                src="/icons/Information.png"
                alt="Info"
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
            </h3>

            <div
              style={{
                flex: 1,
                padding: 3,
                borderRadius: 16,
                background: "linear-gradient(to right, #6C6DCB, #04265eff)",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.85), rgba(255,255,255,0.95))",
                  color: "#1e293b",
                  padding: "20px 24px",
                  borderRadius: 12,
                  fontWeight: "500",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  height: "100%",
                  overflowY: "auto",
                  lineHeight: 1.9,
                  boxSizing: "border-box",
                }}
              >
                {stakeholder.justification ? (
                  <ol style={{ paddingLeft: 20, margin: 0 }}>
                    {formatJustification(
                      typeof stakeholder.justification === "string"
                        ? stakeholder.justification
                        : JSON.stringify(stakeholder.justification)
                    ).map((item, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottom: index < formatJustification(typeof stakeholder.justification === "string" ? stakeholder.justification : JSON.stringify(stakeholder.justification)).length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                          fontSize: 14,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div style={{ textAlign: "center", color: "#6b7280", fontStyle: "italic", marginTop: 40, fontSize: 15 }}>
                    Justification data tidak tersedia untuk stakeholder ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
