// src/components/CreateStakeholderModal.jsx
import React, { useState } from "react";

const CreateStakeholderModal = ({
  isOpen,
  onClose,
  onSubmit,
  roles = [],
  stakeholderTypes = [],
  engagementCategories = [],
  locationCities = [],
  benefits = [],
  interests = [],
  influences = [],
  riskLevels = [],
  opportunities = [],
  contacts = [],
  engagementRelevances = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    stakeholderType: "",
    engagementCategory: "",
    locationCity: "",
    benefit: "",
    interest: "",
    influence: "",
    riskLevel: "",
    opportunity: "",
    contact: "",
    engagementRelevance: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      role: "",
      stakeholderType: "",
      engagementCategory: "",
      locationCity: "",
      benefit: "",
      interest: "",
      influence: "",
      riskLevel: "",
      opportunity: "",
      contact: "",
      engagementRelevance: "",
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Create New Stakeholder</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Stakeholder Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select name="role" value={formData.role} onChange={handleChange} style={styles.input} required>
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id || r} value={r.id || r}>{r.name || r}</option>
            ))}
          </select>

          <select
            name="stakeholderType"
            value={formData.stakeholderType}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Stakeholder Type</option>
            {stakeholderTypes.map((t) => (
              <option key={t.id || t} value={t.id || t}>{t.name || t}</option>
            ))}
          </select>

          <select
            name="engagementCategory"
            value={formData.engagementCategory}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Engagement Category</option>
            {engagementCategories.map((c) => (
              <option key={c.id || c} value={c.id || c}>{c.name || c}</option>
            ))}
          </select>

          <select
            name="locationCity"
            value={formData.locationCity}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Location City</option>
            {locationCities.map((l) => (
              <option key={l.id || l} value={l.id || l}>{l.name || l}</option>
            ))}
          </select>

          <select name="benefit" value={formData.benefit} onChange={handleChange} style={styles.input}>
            <option value="">Select Benefit</option>
            {benefits.map((b) => (
              <option key={b.id || b} value={b.id || b}>{b.name || b}</option>
            ))}
          </select>

          <select name="interest" value={formData.interest} onChange={handleChange} style={styles.input}>
            <option value="">Select Interest</option>
            {interests.map((i) => (
              <option key={i.id || i} value={i.id || i}>{i.name || i}</option>
            ))}
          </select>

          <select name="influence" value={formData.influence} onChange={handleChange} style={styles.input}>
            <option value="">Select Influence</option>
            {influences.map((inf) => (
              <option key={inf.id || inf} value={inf.id || inf}>{inf.name || inf}</option>
            ))}
          </select>

          <select name="riskLevel" value={formData.riskLevel} onChange={handleChange} style={styles.input}>
            <option value="">Select Risk Level</option>
            {riskLevels.map((r) => (
              <option key={r.id || r} value={r.id || r}>{r.name || r}</option>
            ))}
          </select>

          <select name="opportunity" value={formData.opportunity} onChange={handleChange} style={styles.input}>
            <option value="">Select Opportunity</option>
            {opportunities.map((o) => (
              <option key={o.id || o} value={o.id || o}>{o.name || o}</option>
            ))}
          </select>

          <select name="contact" value={formData.contact} onChange={handleChange} style={styles.input}>
            <option value="">Select Contact</option>
            {contacts.map((c) => (
              <option key={c.id || c} value={c.id || c}>{c.name || c}</option>
            ))}
          </select>

          <select
            name="engagementRelevance"
            value={formData.engagementRelevance}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Engagement Relevance</option>
            {engagementRelevances.map((er) => (
              <option key={er.id || er} value={er.id || er}>{er.name || er}</option>
            ))}
          </select>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  title: { marginBottom: "15px", fontSize: "18px", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "8px", borderRadius: "4px", border: "1px solid #ccc" },
  actions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" },
  cancelBtn: { padding: "8px 12px", background: "#ccc", border: "none", borderRadius: "4px", cursor: "pointer" },
  saveBtn: { padding: "8px 12px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
};

export default CreateStakeholderModal;
