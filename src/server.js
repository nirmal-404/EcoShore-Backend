const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const logger = require('./config/logger');
const apiRoutes = require('./routes/index');
const { swaggerUi, specs } = require('./config/swagger');


const organizerRequestRoutes = require('./routes/organizerRequest.routes');
const chatRoutes = require('./routes/chat.routes');
const communityContentRoutes = require('./routes/communityContent.routes');
const eventRoutes = require('./routes/event.routes');

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

app.use('/organizer-requests', organizerRequestRoutes);
app.use('/chat', chatRoutes);
app.use('/community', communityContentRoutes);
app.use('/events', eventRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
