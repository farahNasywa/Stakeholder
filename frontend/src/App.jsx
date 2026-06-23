import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import StakeholderProfileSetup from './pages/StakeholderProfileSetup';
import EngagementPriority from './pages/EngagementPriority';
import EngagementJustification from './pages/EngagementJustification';
import EngagementJustificationList from './pages/EngagementJustificationList';
import ValidationBPMA from './pages/ValidationBPMA';
import ValidationKKKS from './pages/ValidationKKKS';
import DeepAnalysist from './pages/DeepAnalysist';
import DeepAnalysist2 from './pages/DeepAnalysist2';
import ClusterQuestions from './pages/ClusterQuestions';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './context/DataContext.jsx';
import './App.css';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <div className="App min-h-screen bg-gradient-subtle">
            <Routes>
              <Route path="/" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/welcome" element={<PageTransition><WelcomePage /></PageTransition>} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageTransition><DashboardPage /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/about" element={
                <ProtectedRoute>
                  <PageTransition><AboutPage /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/faq" element={
                <ProtectedRoute>
                  <PageTransition><FAQPage /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/stakeholderprofilesetup/:id?" element={
                <ProtectedRoute>
                  <PageTransition><StakeholderProfileSetup /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/engagement-priority/:id?" element={
                <ProtectedRoute>
                  <PageTransition><EngagementPriority /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/engagementjustification/:id?" element={
                <ProtectedRoute>
                  <PageTransition><EngagementJustification /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/engagement-justification" element={
                <ProtectedRoute>
                  <PageTransition><EngagementJustificationList /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/validation-bpma" element={
                <ProtectedRoute>
                  <PageTransition><ValidationBPMA /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/validation-kkks" element={
                <ProtectedRoute>
                  <PageTransition><ValidationKKKS /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/deep-analysis" element={
                <ProtectedRoute>
                  <PageTransition><DeepAnalysist /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/deep-analysist/:id" element={
                <ProtectedRoute>
                  <PageTransition><DeepAnalysist /></PageTransition>
                </ProtectedRoute>
              } />

              <Route path="/deep-analysis-2" element={
                <ProtectedRoute>
                  <PageTransition><DeepAnalysist2 /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/deep-analysist2/:id" element={
                <ProtectedRoute>
                  <PageTransition><DeepAnalysist2 /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/cluster-questions/:clusterId" element={
                <ProtectedRoute>
                  <PageTransition><ClusterQuestions /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/cluster/:clusterId" element={
                <ProtectedRoute>
                  <PageTransition><ClusterQuestions /></PageTransition>
                </ProtectedRoute>
              } />

              <Route path="/cluster/:clusterId/:stakeholderId" element={
                <ProtectedRoute>
                  <PageTransition><ClusterQuestions /></PageTransition>
                </ProtectedRoute>
              } />
              
              {/* Catch all route - redirect to login */}
              <Route path="*" element={<PageTransition><LoginPage /></PageTransition>} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;