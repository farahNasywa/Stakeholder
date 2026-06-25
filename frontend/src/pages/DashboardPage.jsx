import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";
import "./DashboardPage.css";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/bg-card.jpg";
import handshakeImage from "../assets/handshake-industrial.png";
import petaBpma from "../assets/peta-bpma.png";
import searchIcon from "../assets/icon-search.svg";
import filterIcon from "../assets/icon-filter.svg";
import { FaTasks } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_URL = "/api/stakeholders";

const RADIAN = Math.PI / 180;
const renderInsideLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="bold">
      {value}
    </text>
  );
};

const CATEGORY_COLORS = { Primary: "#3B82F6", Secondary: "#10B981", Tertiary: "#F59E0B" };
const STATUS_COLORS = { Approved: "#22C55E", Pending: "#EAB308", Rejected: "#EF4444" };

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showStepCard, setShowStepCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [chartData, setChartData] = useState({ categories: [], statuses: [] });
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(API_URL)
      .then((res) => {
        const stakeholders = res.data;
        const catCount = {};
        const statusCount = {};
        stakeholders.forEach((s) => {
          const cat = s.engagementCategory || "Unknown";
          const st = s.status || "Unknown";
          catCount[cat] = (catCount[cat] || 0) + 1;
          statusCount[st] = (statusCount[st] || 0) + 1;
        });
        setChartData({
          categories: Object.entries(catCount).map(([name, value]) => ({ name, value })),
          statuses: Object.entries(statusCount).map(([name, value]) => ({ name, value })),
        });
      })
      .catch(() => {});
  }, []);

  const fetchStakeholders = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSuggestion(false);
      setShowStepCard(true);
      setSelectedStakeholder(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get(`${API_URL}/search?q=${query}`);
      setSearchResults(response.data);
      setShowSuggestion(response.data.length > 0);
      setShowStepCard(false);
      setSelectedStakeholder(null);
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
      setSearchResults([]);
      setShowSuggestion(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchStakeholders(value);
  };

  const handleStakeholderClick = (stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setShowSuggestion(false);
  };

  const handleContinueClick = () => {
    if (selectedStakeholder) {
      navigate(`/engagement-priority/${selectedStakeholder._id}`);
    }
  };

  const handleNoClick = () => {
    setShowSuggestion(false);
    setShowStepCard(true);
    setSelectedStakeholder(null);
  };

  const handleFilterClick = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSuggestion(false);
    setShowStepCard(true);
    setSelectedStakeholder(null);
  };

  const handleSearchIconClick = () => {
    if (searchTerm.trim() !== "") {
      fetchStakeholders(searchTerm);
    }
  };

  const handleDeepAnalysisClick = () => navigate('/stakeholderprofilesetup');
  const handleJustificationClick = () => navigate('/engagementjustification');

  const needsId = () => alert("Silakan cari dan pilih stakeholder terlebih dahulu.");

  const steps = [
    {
      title: "Open Main Dashboard",
      desc: "Make sure you are on the main page of the application.",
      onClick: () => navigate('/dashboard'),
    },
    {
      title: "Search Name",
      desc: "Type the name you want to find in the search bar.",
      onClick: () => searchInputRef.current?.focus(),
    },
    {
      title: "Check Engagement Priority",
      desc: "Decide whether to proceed to Engagement Priority or not.",
      onClick: needsId,
    },
    {
      title: "Go to Engagement Priority",
      desc: "If needed, click YES to open the Engagement Priority Page and click Next.",
      onClick: needsId,
    },
    {
      title: "Stakeholder Setup Profile",
      desc: "If not needed, stay on the Deep Analysis Page to view detailed data.",
      onClick: needsId,
    },
    {
      title: "Engagement Justification",
      desc: "Delivers smart insights on whether and why to engage each stakeholder.",
      onClick: needsId,
    },
    {
      title: "Fill in Data",
      desc: "Select a form, then fill in the Reengagement Status & Trigger Reason.",
      onClick: needsId,
    },
    {
      title: "Restart to Beginning",
      desc: "Click the three-line (menu) button in the top corner, select Main Dashboard to start over.",
      onClick: () => navigate('/dashboard'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="dashboard-container">
        {/* Kiri: Stakeholder Card */}
        <div className="flex-1" style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", minHeight: 0 }}>
          <div
            className="stakeholder-card horizontal"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
            }}
          >
            {/* Top: image + teks */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1 }}>
              <div className="image-wrapper">
                <img src={handshakeImage} alt="Handshake" className="stakeholder-image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="stakeholder-content" style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 className="stakeholder-title">Stakeholders</h2>
                <h3 className="stakeholder-subtitle">Managed Engagement Protocol</h3>
                <p className="stakeholder-desc">
                  Stakeholders who are moderately influential or affected by the project.
                </p>
                <p className="stakeholder-text">
                  They may support, regulate, advise, or observe, but do not hold decisive power or experience direct impact on core operations. Engagement is routine or issue-based, not continuous.
                </p>
              </div>
            </div>


            {/* Peta BPMA - klik untuk buka */}
            <a
              href="https://www.bpma.go.id/wilayah-kerja-migas-aceh/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", borderRadius: 12, overflow: "hidden", margin: "4px 0", cursor: "pointer" }}
            >
              <img
                src={petaBpma}
                alt="Peta Wilayah Kewenangan BPMA"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </a>

            {(() => {
              const catData = chartData.categories.length > 0
                ? chartData.categories
                : [{ name: "Primary", value: 1 }, { name: "Secondary", value: 1 }, { name: "Tertiary", value: 1 }];
              const statData = chartData.statuses.length > 0
                ? chartData.statuses
                : [{ name: "Approved", value: 1 }, { name: "Pending", value: 1 }, { name: "Rejected", value: 1 }];
              return (
                <div
                  style={{
                    flexShrink: 0,
                    marginTop: 0,
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: "8px 8px 2px",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 200,
                  }}
                >
                  <h4 style={{ textAlign: "center", fontWeight: "bold", color: "#fff", marginBottom: 2, fontSize: 12 }}>
                    Stakeholder Overview
                  </h4>
                  <div style={{ display: "flex", gap: 8, flex: 1 }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.8)", marginBottom: 0 }}>By Category</p>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie
                            data={catData}
                            dataKey="value"
                            cx="35%"
                            cy="50%"
                            outerRadius={50}
                            innerRadius={22}
                            paddingAngle={4}
                            label={renderInsideLabel}
                            labelLine={false}
                          >
                            {catData.map((entry) => (
                              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94A3B8"} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend iconSize={8} layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 9, color: "#fff" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.8)", marginBottom: 0 }}>By Status</p>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie
                            data={statData}
                            dataKey="value"
                            cx="35%"
                            cy="50%"
                            outerRadius={50}
                            innerRadius={22}
                            paddingAngle={4}
                            label={renderInsideLabel}
                            labelLine={false}
                          >
                            {statData.map((entry) => (
                              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94A3B8"} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend iconSize={8} layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 9, color: "#fff" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* === Search & Step Column === */}
        <div className="right-column">
          <div style={{ flexShrink: 0, marginBottom: 12 }}>
            <div className="search-bar-wrapper">
              <div className="icon-left" onClick={handleFilterClick} style={{ cursor: "pointer" }}>
                <img src={filterIcon} alt="Filter" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search Stakeholder By Name . . ."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="icon-right" onClick={handleSearchIconClick} style={{ cursor: "pointer" }}>
                <img src={searchIcon} alt="Search" />
              </div>
            </div>

            {isLoading && <div className="loading-message">Mencari data...</div>}

            {showSuggestion && searchResults.length > 0 && !selectedStakeholder && (
              <div className="search-dropdown">
                {searchResults.map((stakeholder) => (
                  <div
                    key={stakeholder._id}
                    className="search-dropdown-item"
                    onClick={() => handleStakeholderClick(stakeholder)}
                  >
                    {stakeholder.name} ({stakeholder.role ? stakeholder.role.name : "-"})
                  </div>
                ))}
              </div>
            )}

            {selectedStakeholder && (
              <div className="search-result-table">
                <div className="header-row">
                  <div>Stakeholder Name</div>
                  <div>Role</div>
                  <div>Stakeholder Type</div>
                  <div>Category</div>
                </div>
                <div key={selectedStakeholder._id} className="data-row">
                  <div>{selectedStakeholder.name}</div>
                  <div>{selectedStakeholder.role ? selectedStakeholder.role.name : "-"}</div>
                  <div>{selectedStakeholder.stakeholderType ? selectedStakeholder.stakeholderType.name : "-"}</div>
                  <div>{selectedStakeholder.engagementCategory}</div>
                </div>
                <div className="engagement-popup">
                  <div className="popup-title">Continue to Engagement Priority</div>
                  <div className="popup-buttons">
                    <button className="yes-btn" onClick={handleContinueClick}>Yes</button>
                    <button className="no-btn" onClick={handleNoClick}>NO</button>
                  </div>
                </div>
              </div>
            )}

            {showSuggestion && searchResults.length === 0 && !isLoading && (
              <div className="no-results-message">Tidak ada data yang ditemukan.</div>
            )}
          </div>

          {showStepCard && (
            <div className="step-card" style={{ flex: 1, minHeight: 0 }}>
              <div className="step-header">
                <h3 className="flex flex-row justify-center items-center">
                  <FaTasks style={{ marginRight: 8 }} /> User Navigation Steps
                </h3>
              </div>
              <div className="step-grid">
                {steps.map((step, index) => (
                  <div
                    className="step-box"
                    key={index}
                    onClick={step.onClick}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
