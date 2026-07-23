import React from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhone,
  FaHandshake,
  FaChartLine,
  FaExclamationTriangle,
  FaStar,
  FaLightbulb,
  FaBullseye,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Style yang identik dipakai di form Add Stakeholder maupun Edit Stakeholder,
// supaya keduanya konsisten dan mudah dipelihara dari satu tempat.

export const inputStyle = {
  width: "100%",
  padding: "10px 15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
  color: "#374151",
};

export const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>\')',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "12px",
  paddingRight: "35px",
};

export const labelStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
  fontWeight: "500",
  color: "#374151",
  fontSize: "14px",
  gap: "8px",
};

// Tanda bintang merah untuk field wajib. Ditaruh sejajar dengan teks
// label (label pakai display:flex + alignItems:center) supaya rapi di
// desktop maupun mobile.
const requiredMarkStyle = {
  color: "#DC2626",
  fontSize: "18px",
  fontWeight: 700,
  marginLeft: "2px",
};

const RequiredMark = () => <span style={requiredMarkStyle}>*</span>;

// Style pesan error yang tampil di bawah field ketika field wajib
// dikosongkan saat submit.
const errorTextStyle = {
  color: "#DC2626",
  fontSize: "12px",
  marginTop: "6px",
};

const errorInputStyle = {
  borderColor: "#DC2626",
};

const FieldError = ({ message }) =>
  message ? <p style={errorTextStyle}>{message}</p> : null;

/**
 * StakeholderFormFields
 *
 * Satu-satunya sumber kebenaran untuk field, urutan, styling, dan
 * perilaku form Stakeholder. Dipakai oleh EditStakeholderModal (mode edit)
 * dan AddStakeholderPage (mode tambah) supaya keduanya identik persis,
 * sesuai permintaan: "Jangan membuat dua versi komponen yang berbeda."
 *
 * Field & urutan wajib:
 * Name, Role, Province, City, District, Contact, Stakeholder Type,
 * Engagement Category, Influence, Interest, Risk Level, Opportunity,
 * Benefit, Engagement Strategy, Engagement Frequency.
 * Hanya Name dan Contact yang berupa text input; sisanya dropdown.
 *
 * Field WAJIB (tampil dengan tanda bintang merah "*"): Stakeholder Name,
 * Stakeholder Type, Category/Engagement Category, Province, City,
 * Influence, Interest, Risk Level, Opportunity, Benefit, Engagement
 * Strategy, Engagement Frequency.
 * Field OPSIONAL (tanpa bintang): Role, District, Contact.
 *
 * Prop `errors` (opsional): object { [fieldName]: "pesan error" } dalam
 * bahasa Inggris, dipakai untuk menampilkan pesan validasi di bawah
 * field terkait. Key-nya: name, stakeholderType, engagementCategory,
 * province, city, influence, interest, riskLevel, opportunity, benefit,
 * engagementStrategy, engagementFrequency.
 */
export default function StakeholderFormFields({
  form,
  onChange,
  onProvinceChange,
  onCityChange,
  roles = [],
  stakeholderTypes = [],
  strategies = [],
  frequencies = [],
  locations = [],
  selectedProvince,
  selectedCity,
  errors = {},
}) {
  const { t } = useTranslation();

  return (
    <div>
    {/* Keterangan field wajib */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "18px",
        fontSize: "14px",
        color: "#6B7280",
      }}
    >
      <span
        style={{
          color: "#DC2626",
          fontSize: "18px",
          fontWeight: "700",
        }}
      >
        *
      </span>
      Required fields
    </div>
      
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px 30px",
      }}
    >
      {/* Stakeholder Name */}
      <div>
        <label style={labelStyle}>
          <FaUserCircle />
          {t("stakeholderForm.labels.name")}
          <RequiredMark />
        </label>
        <input
          type="text"
          name="name"
          value={form.name || ""}
          onChange={onChange}
          style={errors.name ? { ...inputStyle, ...errorInputStyle } : inputStyle}
          aria-required="true"
          aria-invalid={!!errors.name}
          required
        />
        <FieldError message={errors.name} />
      </div>

      {/* Role */}
      <div>
        <label style={labelStyle}>
          <FaUsers />
          {t("stakeholderForm.labels.role")}
          <RequiredMark />
        </label>
        <select
          name="role"
          value={form.role || ""}
          onChange={onChange}
          style={selectStyle}
        >
          <option value="">{t("stakeholderForm.placeholders.selectRole")}</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {t(`dashboard.card.roles.${role.name}`, role.name)}
            </option>
          ))}
        </select>
      </div>

      {/* Province */}
      <div>
        <label style={labelStyle}>
          <FaMapMarkerAlt />
          {t("stakeholderForm.labels.province")}
          <RequiredMark />
        </label>
        <select
          name="location.province"
          value={form.location?.province || ""}
          onChange={onProvinceChange}
          style={errors.province ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.province}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectProvince")}</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.province} />
      </div>

      {/* City */}
      <div>
        <label style={labelStyle}>
          <FaBuilding />
          {t("stakeholderForm.labels.city")}
          <RequiredMark />
        </label>
        <select
          name="location.city"
          value={form.location?.city || ""}
          onChange={onCityChange}
          style={errors.city ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          disabled={!selectedProvince}
          aria-required="true"
          aria-invalid={!!errors.city}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectCity")}</option>
          {selectedProvince?.cities?.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.city} />
      </div>

      {/* District (opsional) */}
      <div>
        <label style={labelStyle}>
          <FaBuilding />
          {t("stakeholderForm.labels.district")}
        </label>
        <select
          name="location.district"
          value={form.location?.district || ""}
          onChange={onChange}
          style={selectStyle}
          disabled={!selectedCity}
        >
          <option value="">{t("stakeholderForm.placeholders.selectDistrict")}</option>
          {selectedCity?.districts?.map((district) => (
            <option key={district.name} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contact (opsional) */}
      <div>
        <label style={labelStyle}>
          <FaPhone />
          {t("stakeholderForm.labels.contact")}
        </label>
        <input
          type="text"
          name="contact"
          value={form.contact || ""}
          onChange={onChange}
          style={inputStyle}
          placeholder={t("stakeholderForm.placeholders.contact")}
        />
      </div>

      {/* Stakeholder Type */}
      <div>
        <label style={labelStyle}>
          <FaUsers />
          {t("stakeholderForm.labels.stakeholderType")}
          <RequiredMark />
        </label>
        <select
          name="stakeholderType"
          value={form.stakeholderType || ""}
          onChange={onChange}
          style={errors.stakeholderType ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.stakeholderType}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectStakeholderType")}</option>
          {stakeholderTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {t(`dashboard.card.types.${type.name}`, type.name)}
            </option>
          ))}
        </select>
        <FieldError message={errors.stakeholderType} />
      </div>

      {/* Engagement Category */}
      <div>
        <label style={labelStyle}>
          <FaChartLine />
          {t("stakeholderForm.labels.engagementCategory")}
          <RequiredMark />
        </label>
        <select
          name="engagementCategory"
          value={form.engagementCategory || ""}
          onChange={onChange}
          style={errors.engagementCategory ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.engagementCategory}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectCategory")}</option>
          <option value="Primary">{t("stakeholderForm.categoryOptions.primary")}</option>
          <option value="Secondary">{t("stakeholderForm.categoryOptions.secondary")}</option>
          <option value="Tertiary">{t("stakeholderForm.categoryOptions.tertiary")}</option>
        </select>
        <FieldError message={errors.engagementCategory} />
      </div>

      {/* Influence */}
      <div>
        <label style={labelStyle}>
          <FaStar />
          {t("stakeholderForm.labels.influence")}
          <RequiredMark />
        </label>
        <select
          name="influence"
          value={form.influence || ""}
          onChange={onChange}
          style={errors.influence ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.influence}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectInfluence")}</option>
          <option value="low">{t("stakeholderForm.levelOptions.low")}</option>
          <option value="medium">{t("stakeholderForm.levelOptions.medium")}</option>
          <option value="high">{t("stakeholderForm.levelOptions.high")}</option>
        </select>
        <FieldError message={errors.influence} />
      </div>

      {/* Interest */}
      <div>
        <label style={labelStyle}>
          <FaStar />
          {t("stakeholderForm.labels.interest")}
          <RequiredMark />
        </label>
        <select
          name="interest"
          value={form.interest || ""}
          onChange={onChange}
          style={errors.interest ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.interest}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectInterest")}</option>
          <option value="low">{t("stakeholderForm.levelOptions.low")}</option>
          <option value="medium">{t("stakeholderForm.levelOptions.medium")}</option>
          <option value="high">{t("stakeholderForm.levelOptions.high")}</option>
        </select>
        <FieldError message={errors.interest} />
      </div>

      {/* Risk Level */}
      <div>
        <label style={labelStyle}>
          <FaExclamationTriangle />
          {t("stakeholderForm.labels.riskLevel")}
          <RequiredMark />
        </label>
        <select
          name="riskLevel"
          value={form.riskLevel || ""}
          onChange={onChange}
          style={errors.riskLevel ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.riskLevel}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectRiskLevel")}</option>
          <option value="low">{t("stakeholderForm.levelOptions.low")}</option>
          <option value="medium">{t("stakeholderForm.levelOptions.medium")}</option>
          <option value="high">{t("stakeholderForm.levelOptions.high")}</option>
        </select>
        <FieldError message={errors.riskLevel} />
      </div>

      {/* Opportunity */}
      <div>
        <label style={labelStyle}>
          <FaLightbulb />
          {t("stakeholderForm.labels.opportunity")}
          <RequiredMark />
        </label>
        <select
          name="opportunity"
          value={form.opportunity || ""}
          onChange={onChange}
          style={errors.opportunity ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.opportunity}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectOpportunity")}</option>
          <option value="low">{t("stakeholderForm.levelOptions.low")}</option>
          <option value="medium">{t("stakeholderForm.levelOptions.medium")}</option>
          <option value="high">{t("stakeholderForm.levelOptions.high")}</option>
        </select>
        <FieldError message={errors.opportunity} />
      </div>

      {/* Benefit */}
      <div>
        <label style={labelStyle}>
          <FaBullseye />
          {t("stakeholderForm.labels.benefit")}
          <RequiredMark />
        </label>
        <select
          name="benefit"
          value={form.benefit || ""}
          onChange={onChange}
          style={errors.benefit ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.benefit}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectBenefit")}</option>
          <option value="low">{t("stakeholderForm.levelOptions.low")}</option>
          <option value="medium">{t("stakeholderForm.levelOptions.medium")}</option>
          <option value="high">{t("stakeholderForm.levelOptions.high")}</option>
        </select>
        <FieldError message={errors.benefit} />
      </div>

      {/* Engagement Strategy */}
      <div>
        <label style={labelStyle}>
          <FaHandshake />
          {t("stakeholderForm.labels.engagementStrategy")}
          <RequiredMark />
        </label>
        <select
          name="engagementStrategy"
          value={form.engagementStrategy || ""}
          onChange={onChange}
          style={errors.engagementStrategy ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.engagementStrategy}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectStrategy")}</option>
          {strategies.map((strategy) => (
            <option key={strategy._id} value={strategy._id}>
              {t(`deepAnalysist.strategyText.${strategy.strategy}`, t(`engagementPriority.strategies.${strategy.strategy}`, strategy.strategy))}
            </option>
          ))}
        </select>
        <FieldError message={errors.engagementStrategy} />
      </div>

      {/* Engagement Frequency */}
      <div>
        <label style={labelStyle}>
          <FaCalendarAlt />
          {t("stakeholderForm.labels.engagementFrequency")}
          <RequiredMark />
        </label>
        <select
          name="engagementFrequency"
          value={form.engagementFrequency || ""}
          onChange={onChange}
          style={errors.engagementFrequency ? { ...selectStyle, ...errorInputStyle } : selectStyle}
          aria-required="true"
          aria-invalid={!!errors.engagementFrequency}
          required
        >
          <option value="">{t("stakeholderForm.placeholders.selectFrequency")}</option>
          {frequencies.map((frequency) => (
            <option key={frequency._id} value={frequency._id}>
              {t(`deepAnalysist.frequencies.${frequency.name}`, frequency.name)}
            </option>
          ))}
        </select>
        <FieldError message={errors.engagementFrequency} />
      </div>
    </div>
  );
}
