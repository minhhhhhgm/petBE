const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://zqq80867:daicaminh123@cluster0.ucz2u.mongodb.net/Pet?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;