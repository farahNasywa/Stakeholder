import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
import { DataContext } from '../context/DataContext.jsx';
import api from '../utils/api';

const LEVEL_OPTIONS = ['low', 'medium', 'high'];
const CATEGORY_OPTIONS = ['Primary', 'Secondary', 'Tertiary'];

const initialFormState = {
  name: '',
  company: '',
  role: '',
  stakeholderType: '',
  engagementCategory: '',
  influenceLevel: '',
  interestLevel: '',
  riskLevel: '',
  opportunityLevel: '',
  benefitLevel: '',
  position: '',
  email: '',
  phone: '',
  address: '',
  province: '',
  city: '',
  description: '',
  status: 'Approved',
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' },
  }),
};

const AddStakeholderPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addStakeholder } = useContext(DataContext);
  const { addToast, ToastContainer } = useToast();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [roles, setRoles] = useState([]);
  const [stakeholderTypes, setStakeholderTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);

  // Ambil data referensi (roles, stakeholder types, lokasi) dari API asli,
  // bukan data statis, supaya dropdown selalu sinkron dengan database.
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoadingOptions(true);
      try {
        const [rolesRes, typesRes, locationsRes] = await Promise.all([
          api.get('/api/roles'),
          api.get('/api/stakeholder-types'),
          api.get('/api/locations'),
        ]);
        setRoles(rolesRes.data || []);
        setStakeholderTypes(typesRes.data || []);
        setProvinces(locationsRes.data || []);
      } catch (err) {
        console.error('AddStakeholderPage: Failed to load reference data', err);
        addToast(t('addStakeholder.notifications.loadDropdownError'), 'error');
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadReferenceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('addStakeholder.validation.nameRequired');
    }
    if (!formData.role) {
      newErrors.role = t('addStakeholder.validation.roleRequired');
    }
    if (!formData.stakeholderType) {
      newErrors.stakeholderType = t('addStakeholder.validation.typeRequired');
    }
    if (!formData.engagementCategory) {
      newErrors.engagementCategory = t('addStakeholder.validation.categoryRequired');
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('addStakeholder.validation.emailInvalid');
    }
    if (formData.phone && !/^[0-9+\-\s()]{6,20}$/.test(formData.phone)) {
      newErrors.phone = t('addStakeholder.validation.phoneInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast(t('addStakeholder.notifications.errorMessage'), 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        role: formData.role,
        stakeholderType: formData.stakeholderType,
        engagementCategory: formData.engagementCategory,
        location: {
          province: formData.province || undefined,
          city: formData.city || undefined,
        },
        contact: formData.phone || formData.email || null,
        influenceLevel: formData.influenceLevel || 'medium',
        interestLevel: formData.interestLevel || 'medium',
        riskLevel: formData.riskLevel || 'medium',
        opportunityLevel: formData.opportunityLevel || 'medium',
        benefitLevel: formData.benefitLevel || 'high',
        status: formData.status,
        createdBy: localStorage.getItem('name') || 'system',
        // Field tambahan yang belum ada di schema utama tetap dikirim
        // sebagai metadata supaya tidak hilang; backend akan mengabaikan
        // field yang tidak dikenali tanpa memicu error.
        company: formData.company || undefined,
        position: formData.position || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        description: formData.description || undefined,
      };

      // addStakeholder() memanggil POST /api/stakeholders lalu langsung
      // memasukkan hasilnya ke state global (DataContext). Karena itu,
      // Dashboard, Search Bar, dan halaman lain yang membaca dari context
      // yang sama akan langsung menampilkan Stakeholder baru ini tanpa
      // perlu reload browser.
      await addStakeholder(payload);

      addToast(t('addStakeholder.notifications.successMessage'), 'success');
      resetForm();
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      console.error('AddStakeholderPage: Failed to create stakeholder', err);
      const serverMessage = err.response?.data?.message;
      addToast(serverMessage || t('addStakeholder.notifications.errorMessage'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputBase =
    'w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 transition-all duration-200 ' +
    'focus:outline-none focus:ring-2 focus:ring-[#265BA1]/40 focus:border-[#265BA1] ' +
    'placeholder:text-gray-400 bg-white';

  const fieldWrapper = 'flex flex-col gap-1.5';
  const labelClass = 'text-sm font-semibold text-gray-700';
  const helperClass = 'text-xs text-gray-500';
  const errorClass = 'text-xs font-medium text-red-500';

  const errorBorder = (field) =>
    errors[field] ? 'border-red-400' : 'border-gray-200';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7fa] to-white">
      <Navbar />
      <ToastContainer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#204D93]">
            {t('addStakeholder.pageTitle')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('addStakeholder.pageSubtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-10"
        >
          {/* Informasi Umum */}
          <motion.section variants={fadeUp} custom={1} className="space-y-5">
            <h2 className="text-base font-bold text-[#265BA1] border-b border-gray-100 pb-2">
              {t('addStakeholder.sections.general')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="name">
                  {t('addStakeholder.fields.name')} <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.namePlaceholder')}
                  className={`${inputBase} ${errorBorder('name')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.nameHelper')}</p>
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="company">
                  {t('addStakeholder.fields.company')}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.companyPlaceholder')}
                  className={`${inputBase} ${errorBorder('company')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.companyHelper')}</p>
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="role">
                  {t('addStakeholder.fields.role')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoadingOptions}
                  className={`${inputBase} ${errorBorder('role')}`}
                >
                  <option value="">{t('addStakeholder.fields.rolePlaceholder')}</option>
                  {roles.map((r) => (
                    <option key={r._id || r.id} value={r._id || r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <p className={helperClass}>{t('addStakeholder.fields.roleHelper')}</p>
                {errors.role && <p className={errorClass}>{errors.role}</p>}
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="stakeholderType">
                  {t('addStakeholder.fields.type')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="stakeholderType"
                  name="stakeholderType"
                  value={formData.stakeholderType}
                  onChange={handleChange}
                  disabled={isLoadingOptions}
                  className={`${inputBase} ${errorBorder('stakeholderType')}`}
                >
                  <option value="">{t('addStakeholder.fields.typePlaceholder')}</option>
                  {stakeholderTypes.map((st) => (
                    <option key={st._id || st.id} value={st._id || st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
                <p className={helperClass}>{t('addStakeholder.fields.typeHelper')}</p>
                {errors.stakeholderType && (
                  <p className={errorClass}>{errors.stakeholderType}</p>
                )}
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="engagementCategory">
                  {t('addStakeholder.fields.category')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="engagementCategory"
                  name="engagementCategory"
                  value={formData.engagementCategory}
                  onChange={handleChange}
                  className={`${inputBase} ${errorBorder('engagementCategory')}`}
                >
                  <option value="">{t('addStakeholder.fields.categoryPlaceholder')}</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className={helperClass}>{t('addStakeholder.fields.categoryHelper')}</p>
                {errors.engagementCategory && (
                  <p className={errorClass}>{errors.engagementCategory}</p>
                )}
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="position">
                  {t('addStakeholder.fields.position')}
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.positionPlaceholder')}
                  className={`${inputBase} ${errorBorder('position')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.positionHelper')}</p>
              </div>
            </div>
          </motion.section>

          {/* Penilaian Stakeholder */}
          <motion.section variants={fadeUp} custom={2} className="space-y-5">
            <h2 className="text-base font-bold text-[#265BA1] border-b border-gray-100 pb-2">
              {t('addStakeholder.sections.assessment')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: 'influenceLevel', label: 'influence', helper: 'influenceHelper' },
                { key: 'interestLevel', label: 'interest', helper: 'interestHelper' },
                { key: 'riskLevel', label: 'riskLevel', helper: 'riskLevelHelper' },
                { key: 'opportunityLevel', label: 'opportunity', helper: 'opportunityHelper' },
                { key: 'benefitLevel', label: 'benefit', helper: 'benefitHelper' },
              ].map(({ key, label, helper }) => (
                <div className={fieldWrapper} key={key}>
                  <label className={labelClass} htmlFor={key}>
                    {t(`addStakeholder.fields.${label}`)}
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={`${inputBase} ${errorBorder(key)}`}
                  >
                    <option value="">{t('common.selectOption')}</option>
                    {LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {t(`common.${lvl}`)}
                      </option>
                    ))}
                  </select>
                  <p className={helperClass}>{t(`addStakeholder.fields.${helper}`)}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Informasi Kontak */}
          <motion.section variants={fadeUp} custom={3} className="space-y-5">
            <h2 className="text-base font-bold text-[#265BA1] border-b border-gray-100 pb-2">
              {t('addStakeholder.sections.contact')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="email">
                  {t('addStakeholder.fields.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.emailPlaceholder')}
                  className={`${inputBase} ${errorBorder('email')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.emailHelper')}</p>
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="phone">
                  {t('addStakeholder.fields.phone')}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.phonePlaceholder')}
                  className={`${inputBase} ${errorBorder('phone')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.phoneHelper')}</p>
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>

              <div className={`${fieldWrapper} sm:col-span-2`}>
                <label className={labelClass} htmlFor="address">
                  {t('addStakeholder.fields.address')}
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.addressPlaceholder')}
                  className={`${inputBase} ${errorBorder('address')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.addressHelper')}</p>
              </div>
            </div>
          </motion.section>

          {/* Lokasi */}
          <motion.section variants={fadeUp} custom={4} className="space-y-5">
            <h2 className="text-base font-bold text-[#265BA1] border-b border-gray-100 pb-2">
              {t('addStakeholder.sections.location')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="province">
                  {t('addStakeholder.fields.province')}
                </label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  disabled={isLoadingOptions}
                  className={`${inputBase} ${errorBorder('province')}`}
                >
                  <option value="">{t('addStakeholder.fields.provincePlaceholder')}</option>
                  {provinces.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className={helperClass}>{t('addStakeholder.fields.provinceHelper')}</p>
              </div>

              <div className={fieldWrapper}>
                <label className={labelClass} htmlFor="city">
                  {t('addStakeholder.fields.city')}
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.cityPlaceholder')}
                  className={`${inputBase} ${errorBorder('city')}`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.cityHelper')}</p>
              </div>

              <div className={`${fieldWrapper} sm:col-span-2`}>
                <label className={labelClass} htmlFor="description">
                  {t('addStakeholder.fields.description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t('addStakeholder.fields.descriptionPlaceholder')}
                  className={`${inputBase} ${errorBorder('description')} resize-none`}
                />
                <p className={helperClass}>{t('addStakeholder.fields.descriptionHelper')}</p>
              </div>
            </div>
          </motion.section>

          {/* Actions */}
          <motion.div
            variants={fadeUp}
            custom={5}
            className="flex flex-col sm:flex-row justify-end gap-3 pt-2"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {t('addStakeholder.buttons.cancel')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {t('addStakeholder.buttons.reset')}
            </button>
            <motion.button
              type="submit"
              disabled={isSaving}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-lg bg-[#265BA1] text-white text-sm font-semibold shadow-sm hover:bg-[#1f4a84] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {isSaving
                ? t('addStakeholder.buttons.saving')
                : t('addStakeholder.buttons.save')}
            </motion.button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  );
};

export default AddStakeholderPage;
