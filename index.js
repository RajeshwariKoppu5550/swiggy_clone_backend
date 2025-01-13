//this our main file in backend
const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require('./routes/vendorRoutes');
// const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes')
const app = express()
const PORT = 5000 || 4000;
dotEnv.config();
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));
app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})
app.use(express.json());
app.use('/home', (req, res) => {
    res.send("<h1>welcome")
})
// //
app.use('/product', productRoutes);
app.use("/firm", firmRoutes);
app.use('/vendor', vendorRoutes);
