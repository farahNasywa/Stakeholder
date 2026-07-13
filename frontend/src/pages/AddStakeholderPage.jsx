import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
import StakeholderFormFields from '../components/StakeholderFormFields.jsx';
import useStakeholderForm from '../hooks/useStakeholderForm.js';
import { DataContext } from '../context/DataContext.jsx';
import api from '../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const AddStakeholderPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addStakeholder } = useContext(DataContext);
  const { addToast, ToastContainer } = useToast();
  const currentUserRole = (localStorage.getItem('role') || '').toLowerCase();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [roles, setRoles] = useState([]);
  const [stakeholderTypes, setStakeholderTypes] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [locations, setLocations] = useState([]);

  // Form identik dengan Edit Stakeholder: field, urutan, dan perilaku
  // berasal dari hook + komponen yang sama (lihat StakeholderFormFields.jsx).
  const {
    form,
    selectedProvince,
    selectedCity,
    handleChange,
    handleProvinceChange,
    handleCityChange,
    resetForm,
  } = useStakeholderForm(null, locations);

  // Ambil semua data referensi dari API asli (bukan data statis), supaya
  // dropdown Add Stakeholder selalu sinkron 1:1 dengan Edit Stakeholder.
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoadingOptions(true);
      try {
        const [rolesRes, typesRes, locationsRes, strategiesRes, frequenciesRes] =
          await Promise.all([
            api.get('/api/roles'),
            api.get('/api/stakeholder-types'),
            api.get('/api/locations'),
            api.get('/api/engagement-strategies'),
            api.get('/api/engagement-frequencies'),
          ]);
        setRoles(rolesRes.data || []);
        setStakeholderTypes(typesRes.data || []);
        setLocations(locationsRes.data || []);
        setStrategies(strategiesRes.data || []);
        setFrequencies(frequenciesRes.data || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name?.trim() || !form.role) {
      addToast(t('addStakeholder.notifications.errorMessage'), 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role,
        stakeholderType: form.stakeholderType,
        engagementCategory: form.engagementCategory,
        location: {
          province: form.location.province || undefined,
          city: form.location.city || undefined,
          district: form.location.district || undefined,
        },
        contact: form.contact || null,
        influenceLevel: form.influence || 'medium',
        interestLevel: form.interest || 'medium',
        riskLevel: form.riskLevel || 'medium',
        opportunityLevel: form.opportunity || 'medium',
        benefitLevel: form.benefit || 'high',
        engagementStrategy: form.engagementStrategy || undefined,
        engagementFrequency: form.engagementFrequency || undefined,
        // Alur validasi: KKKS/role lain -> Pending sampai direview BPMA.
        // BPMA sendiri adalah approver, jadi data yang ia tambahkan
        // langsung Approved (tidak perlu me-review dirinya sendiri).
        status: currentUserRole === 'bpma' ? 'Approved' : 'Pending',
        createdBy: localStorage.getItem('name') || 'system',
      };

      // addStakeholder() memanggil POST /api/stakeholders lalu langsung
      // memasukkan hasilnya ke state global (DataContext), sehingga
      // Dashboard/Search Bar/halaman lain otomatis ter-update.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7fa] to-white">
      <Navbar />
      <ToastContainer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#204D93]">
            {t('stakeholderForm.addTitle')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('stakeholderForm.addSubtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
        >
          <StakeholderFormFields
            form={form}
            onChange={handleChange}
            onProvinceChange={handleProvinceChange}
            onCityChange={handleCityChange}
            roles={roles}
            stakeholderTypes={stakeholderTypes}
            strategies={strategies}
            frequencies={frequencies}
            locations={locations}
            selectedProvince={selectedProvince}
            selectedCity={selectedCity}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {t('stakeholderForm.cancel')}
            </button>
            <motion.button
              type="submit"
              disabled={isSaving || isLoadingOptions}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-lg bg-[#265BA1] text-white text-sm font-semibold shadow-sm hover:bg-[#1f4a84] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {isSaving ? t('stakeholderForm.adding') : t('stakeholderForm.addButton')}
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default AddStakeholderPage;
