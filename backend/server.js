const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./middleware/auth'), require('./routes/notes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
