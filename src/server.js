const dotenv = require('dotenv');

// Load environment variables FIRST, before any other modules
dotenv.config();

const express = require('express');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const apiRoutes = require('./routes/index');
const { swaggerUi, specs } = require('./config/swagger');
const { verifyConnection: verifyEmailConnection } = require('./config/email');
const registerMeetingSocket = require('./socket/meeting.socket');
const registerChatCallSocket = require('./socket/chatCall.socket');

const DEV_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const normalizeOrigin = (origin = '') => {
  return String(origin).trim().replace(/\/+$/, '');
};

const parseConfiguredOrigins = (rawOrigins = '') => {
  return String(rawOrigins)
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
};

require('./config/google.passport.js');

connectDB();

// Verify email configuration on startup
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  verifyEmailConnection()
    .then(() => {
      logger.info('Email service initialized successfully');
    })
    .catch((err) => {
      logger.warn(
        'Email service failed to initialize. Agent credentials emails will not be sent:',
        err.message
      );
    });
} else {
  logger.warn(
    'Gmail credentials not configured. Agent credential emails will not be sent. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.'
  );
}

const app = express();

const configuredOrigins = parseConfiguredOrigins(process.env.FRONTEND_URL || '');
const allowedOrigins =
  configuredOrigins.length > 0
    ? configuredOrigins
    : process.env.NODE_ENV === 'production'
      ? []
      : DEV_ALLOWED_ORIGINS;

if (configuredOrigins.length === 0 && process.env.NODE_ENV === 'production') {
  logger.warn(
    'FRONTEND_URL is not configured in production. Cross-origin browser requests will be rejected.'
  );
}

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.length === 0) {
    return false;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
};

const validateCorsOrigin = (origin, callback) => {
  if (isOriginAllowed(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error('Not allowed by CORS'));
};

const corsOptions = {
  origin: validateCorsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(passport.initialize());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define Routes
app.use('/api', apiRoutes);
// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: validateCorsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

registerMeetingSocket(io);
registerChatCallSocket(io);

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  logger.error(
    `[${req.method}] ${req.originalUrl} → ${statusCode}: ${err.message}`
  );
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
