import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json({ limit: '1mb' }));

// Konfigurasi CORS
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Middleware lainnya
app.use(express.json());
// Fungsi untuk koneksi database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Keluar dari aplikasi jika koneksi gagal
  }
};

// Panggil fungsi koneksi
connectDB();

// Route imports
import stakeholderTypeRoutes from "./routes/stakeholderTypeRoute.js";
import locationRoutes from "./routes/locationRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import engagementFrequencyRoutes from "./routes/engagementFrequencyRoutes.js";
import engagementStrategyRoutes from "./routes/engagementStrategyRoutes.js";
import keyConcernRoutes from "./routes/keyConcernRoutes.js";
import focalPointMappingRoutes from './routes/focalPointMappingRoutes.js';
import stakeholderRoutes from "./routes/stakeholderRoutes.js";
import authRoutes from './routes/authRoutes.js';
import stakeholderChangeRequestRoutes from './routes/stakeholderChangeRequestRoutes.js';
import googleSheetRoutes from './routes/googleSheetRoutes.js';

// Routes
app.use("/api/stakeholder-types", stakeholderTypeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/engagement-frequencies", engagementFrequencyRoutes);
app.use("/api/engagement-strategies", engagementStrategyRoutes);
app.use("/api/key-concerns", keyConcernRoutes);
app.use("/api/focal-point-mappings", focalPointMappingRoutes);
app.use("/api/stakeholders", stakeholderRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/stakeholder-change-requests", stakeholderChangeRequestRoutes);
app.use('/sheets', googleSheetRoutes);
// Start server (only in local dev, not on Vercel)
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;