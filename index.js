require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const migrationRoutes= require('./routes/migrationRoutes')
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://fancy-alfajores-b52bf1.netlify.app',
    'https://diddy-deals.netlify.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Connection events
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', err => console.error('MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

const router = express.Router();
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);
router.use('/migration', migrationRoutes);

router.get('/', (req, res) => {
  res.send('Affiliate API Running');
});

app.use(router);  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;