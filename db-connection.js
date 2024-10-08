const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

const db = mongoose.connect(uri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = db;