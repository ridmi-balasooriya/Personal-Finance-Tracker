const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { // Link expense to a user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number, 
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;