import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import connectToDB from './config/connectToDB.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

console.log('JWT_SECRET:', process.env.JWT_SECRET || 'Not Found');
console.log('MONGO_URI from process.env:', process.env.MONGO_URI || 'Not Found');

const app = express();

// Connect to Database
connectToDB();

// Constants
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Debugging Route Loader
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: err.message || "Something went wrong",
    success: false,
  });
});

// Routes
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';

app.use('/api/user/', userRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/doctor/', doctorRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
