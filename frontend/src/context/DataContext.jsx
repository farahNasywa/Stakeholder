import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stakeholderData, setStakeholderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        console.log('DataContext: Fetching stakeholders from API');
        const response = await axios.get('/api/stakeholders');
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

  const contextValue = {
    stakeholderData,
    loading,
    error,
    updateStakeholderStatus,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}; 