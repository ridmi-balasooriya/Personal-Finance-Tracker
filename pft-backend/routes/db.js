const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user_ridmibalasooriya:P65bOy9Da6agdfOd@cluster0.5hmni.mongodb.net/finance_tracker?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err)
    })