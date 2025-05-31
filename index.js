require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const router = express.Router();
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);

router.get('/', (req, res) => {
  res.send('Affiliate API Running');
});
app.use('/.netlify/functions/api', router);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

module.exports = app;