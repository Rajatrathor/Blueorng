const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middlewares/error.middleware');
const routes = require('./routes');
const openapi = require('./openapi.json');
const sendEmail = require('./utils/email');
const { razorpayWebhook } = require('./modules/payment/payment.controller');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.post('api/payment/webhook', razorpayWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



// Routes
app.use('/api', routes);
app.get('/api/openapi.json', (req, res) => {
  res.json(openapi);
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
