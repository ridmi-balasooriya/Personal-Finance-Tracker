const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://user_ridmibalasooriya:P65bOy9Da6agdfOd@cluster0.5hmni.mongodb.net/finance_tracker?retryWrites=true&w=majority&appName=Cluster0');
        console.log('✅ Connected to MongoDB')
    }catch(err){
        console.error('Error connecting to MongoDB:', err)
        process.exit(1); // stop app if DB fails
    }
}

module.exports = connectDB;