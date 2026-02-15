const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const logger = require("./config/logger");
const apiRoutes = require('./routes/index');
const { swaggerUi, specs } = require('./config/swagger');

dotenv.config();
require('./config/google.passport.js');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Define Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
