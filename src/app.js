import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';

const app = express();

// Connect to the database
connectDB();

// Middleware and routes
// ...existing code...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
