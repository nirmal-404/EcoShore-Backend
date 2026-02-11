const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./interfaces/http/routes/auth.routes');

dotenv.config();
require('./infrastructure/auth/google.passport');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Define Routes
app.use('/auth', authRoutes);

// Swagger Documentation

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
