const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');

//get all expenses
router.get('/', auth, async (req, res) => {
    try{
        const userId = req.user.id;
        const expenses = await Expense.find({userId}).populate('category', 'name');
        res.json(expenses);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }   
})

//add new expense
router.post('/', auth, async(req, res) => {
    const {description, amount, date, category} = req.body;
    const userId = req.user.id; // Get user ID from token

    if(!description || !amount || !date || !category){
        return res.status(400).json({message: "Missing required fields"});
    }

    try{
        const formatedDate = new Date(date).toISOString().split('T')[0]; //Extract YYYY-MM-DD
        console.log(formatedDate)
        const newExpense = new Expense({ userId, description, amount, date: formatedDate, category}) //Craete Expense object
        await newExpense.save() //Save to MongoDB

        //Populate category to send back
        await newExpense.populate('category');

        res.status(201).json({message: "Expense added succesfully", newExpense})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router;