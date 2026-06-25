import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaSearch, FaUser, FaFileAlt, FaArrowRight, FaStar, FaBuilding, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

const API_URL = "/api/stakeholders";

const EngagementJustificationList = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [filteredStakeholders, setFilteredStakeholders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stakeholderToDelete, setStakeholderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStakeholdersWithJustification();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStakeholders(stakeholders);
    } else {
      const filtered = stakeholders.filter(stakeholder =>
        stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stakeholder.role && stakeholder.role.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStakeholders(filtered);
    }
  }, [searchTerm, stakeholders]);

  const fetchStakeholdersWithJustification = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get(`${API_URL}/with-justification`);
      setStakeholders(response.data);
      setFilteredStakeholders(response.data);
    } catch (error) {
      console.error("Error fetching stakeholders with justification:", error);
      setError("Failed to load stakeholders with justification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStakeholderClick = (stakeholderId) => {
    navigate(`/engagementjustification/${stakeholderId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getEngagementBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleDeleteClick = (e, stakeholder) => {
    e.stopPropagation(); // Prevent card click navigation
    setStakeholderToDelete(stakeholder);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!stakeholderToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`${API_URL}/${stakeholderToDelete._id}`);
      
      // Update stakeholders list by removing the deleted one
      const updatedStakeholders = stakeholders.filter(s => s._id !== stakeholderToDelete._id);
      setStakeholders(updatedStakeholders);
      setFilteredStakeholders(updatedStakeholders);
      
      setToast({
        show: true,
        message: `${stakeholderToDelete.name} has been successfully deleted`,
        type: "success"
      });
      
      setShowDeleteModal(false);
      setStakeholderToDelete(null);
    } catch (error) {
      console.error("Error deleting stakeholder:", error);
      setToast({
        show: true,
        message: "Failed to delete stakeholder. Please try again.",
        type: "error"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setStakeholderToDelete(null);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-subtle"
    >
      <Navbar />
      
      <div className="min-h-screen p-6 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 shadow-glow"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FaFileAlt className="text-2xl text-primary-foreground" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl font-poppins font-bold text-gradient mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Engagement Justifications
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Comprehensive stakeholder engagement analysis with detailed justifications and strategic recommendations
            </motion.p>
          </div>

          {/* Enhanced Search Section */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-muted-foreground text-lg" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-border rounded-2xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-md hover:shadow-lg"
                placeholder="Search stakeholders or roles..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/60 rounded-full animate-spin animate-pulse"></div>
              </div>
              <span className="mt-4 text-lg font-medium text-muted-foreground">Loading stakeholders...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div 
              className="max-w-md mx-auto bg-destructive/10 border-2 border-destructive/20 text-destructive px-6 py-4 rounded-xl mb-8 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                {error}
              </div>
            </motion.div>
          )}

          {/* Enhanced Stakeholders Grid */}
          {!isLoading && !error && (
            <motion.div 
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {filteredStakeholders.length > 0 ? (
                filteredStakeholders.map((stakeholder, index) => (
                  <motion.div
                    key={stakeholder._id}
                    className="group relative bg-gradient-card border border-border/50 rounded-3xl p-8 cursor-pointer hover-lift hover:border-primary/30 overflow-hidden"
                    onClick={() => handleStakeholderClick(stakeholder._id)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                            <FaUser className="text-xl text-primary-foreground" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card shadow-sm"></div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-poppins font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                            {stakeholder.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <FaBuilding className="text-sm text-muted-foreground mr-2" />
                            <p className="text-sm font-medium text-muted-foreground">
                              {stakeholder.role ? stakeholder.role.name : "No Role"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 group/delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleDeleteClick(e, stakeholder)}
                          title="Delete stakeholder"
                        >
                          <FaTrash className="text-sm group-hover/delete:animate-bounce" />
                        </motion.button>
                        <motion.div
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                          whileHover={{ rotate: 45 }}
                        >
                          <FaArrowRight className="text-sm" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 relative z-10">
                      {/* Type Badge */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center px-3 py-1.5 bg-secondary rounded-lg border border-border/50">
                          <span className="text-xs font-semibold text-secondary-foreground">
                            {stakeholder.stakeholderType ? stakeholder.stakeholderType.name : "N/A"}
                          </span>
                        </div>
                        
                        {/* Engagement Category Badge */}
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-semibold ${getEngagementBadgeColor(stakeholder.engagementCategory)}`}>
                          <FaStar className="mr-1.5" size={10} />
                          {stakeholder.engagementCategory || "N/A"}
                        </div>
                      </div>

                      {/* Justification Preview */}
                      {stakeholder.justificationPreview && (
                        <div className="relative">
                          <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-2xl p-5 border border-border/30">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center mr-3">
                                <FaFileAlt className="text-primary text-sm" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">Justification Preview</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {stakeholder.justificationPreview}
                            </p>
                            
                            {/* Read more indicator */}
                            <div className="flex items-center justify-end mt-3">
                              <span className="text-xs text-primary font-medium group-hover:underline">
                                Read full analysis →
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl"></div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                      <FaFileAlt className="text-3xl text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-poppins font-bold text-foreground mb-3">
                      {searchTerm ? "No matching stakeholders found" : "No justifications available"}
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                      {searchTerm 
                        ? "Try adjusting your search criteria to find relevant stakeholders" 
                        : "Start by creating engagement justifications for your stakeholders"
                      }
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card rounded-3xl p-8 max-w-md w-full border border-border shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle className="text-2xl text-destructive" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Confirm Deletion
              </h3>
              
              <p className="text-muted-foreground mb-2">
                Are you sure you want to delete stakeholder:
              </p>
              
              <p className="text-lg font-semibold text-foreground mb-6">
                "{stakeholderToDelete?.name}"
              </p>
              
              <p className="text-sm text-muted-foreground mb-8">
                This action cannot be undone. All associated data will be permanently removed.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-muted text-muted-foreground rounded-xl font-semibold hover:bg-border hover:text-foreground transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-destructive text-destructive-foreground rounded-xl font-semibold hover:bg-destructive/90 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </motion.div>
  );
};

export default EngagementJustificationList;