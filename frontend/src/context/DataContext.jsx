import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stakeholderData, setStakeholderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        console.log('DataContext: Fetching stakeholders from API');
        const response = await api.get('/api/stakeholders');
        const dataWithIds = response.data.map(item => ({
          ...item,
          id: item.id || item._id
        }));
        console.log('DataContext: Successfully fetched stakeholders', dataWithIds.length);
        setStakeholderData(dataWithIds);
        setLoading(false);
      } catch (err) {
        console.error("DataContext: Failed to fetch stakeholders from API:", err);
        setError("Gagal memuat data stakeholders.");
        setLoading(false);
      }
    };
    fetchStakeholders();
  }, []);

  const updateStakeholderStatus = (id, newStatus) => {
    setStakeholderData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  // Menambahkan Stakeholder baru ke API, lalu langsung memasukkan hasilnya
  // ke dalam state global. Karena DashboardPage, Search Bar, dan halaman lain
  // membaca stakeholderData dari context ini, Stakeholder baru otomatis
  // muncul di seluruh aplikasi tanpa perlu refresh browser.
  const addStakeholder = async (payload) => {
    const response = await api.post('/api/stakeholders', payload);
    const created = response.data?.stakeholder || response.data?.data || response.data;
    const normalized = {
      ...created,
      id: created.id || created._id,
    };
    setStakeholderData(prevData => [normalized, ...prevData]);
    return normalized;
  };

  const refreshStakeholders = async () => {
    try {
      const response = await api.get('/api/stakeholders');
      const dataWithIds = response.data.map(item => ({
        ...item,
        id: item.id || item._id,
      }));
      setStakeholderData(dataWithIds);
    } catch (err) {
      console.error('DataContext: Failed to refresh stakeholders:', err);
    }
  };

  const contextValue = {
    stakeholderData,
    loading,
    error,
    updateStakeholderStatus,
    addStakeholder,
    refreshStakeholders,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}; 
