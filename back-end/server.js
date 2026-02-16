const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

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