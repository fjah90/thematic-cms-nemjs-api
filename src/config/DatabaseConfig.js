const mongoose = require('mongoose');
const uri = process.env.DB_CONNECT;

const connectDB = async () => {
    mongoose
        .connect(uri)
        .catch(err => console.log('err', err))
};

module.exports = connectDB;
