const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json()); 

const allowedOrigins = [
  'https://lumen-log-system-ui.vercel.app', 
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 
}));

app.use('/api/auth' , require('./routes/authRoutes')) ;
app.use('/api/logs' , require('./routes/logRoutes')) ;
app.use('/api/users' , require('./routes/userRoutes')) ;

app.get('/', (req, res) => {
  res.send('LUMEN API is running...');
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/internQuest')
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});