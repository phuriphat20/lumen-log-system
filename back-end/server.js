const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'https://lumen-log-system-ui.vercel.app', 
    'https://lumen-log-system-dm015ljr4-phuriphats-projects-60c71432.vercel.app', 
    'http://localhost:5173' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/auth' , require('./routes/authRoutes')) ;
app.use('/api/logs' , require('./routes/logRoutes')) ;
app.use('/api/users' , require('./routes/userRoutes')) ;

// Test Route
app.get('/', (req, res) => {
  res.send('LUMEN API is running...');
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/internQuest')
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});