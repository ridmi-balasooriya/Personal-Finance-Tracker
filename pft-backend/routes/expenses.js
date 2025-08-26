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

router.put('/:id', auth, async (req, res) => {
    const {date, category, description, amount} = req.body;
    const userId = req.user.id;

    if(!date || !category || !description || !amount){
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try{
        const expense = await Expense.findOne({ _id: req.params.id, userId })
        if(!expense){
            return res.status(404).json({ message: "Expense not found" });
        }
        
        expense.date = new Date(date).toISOString().split('T')[0];
        expense.category = category;
        expense.description = description;
        expense.amount = amount;

        await expense.save();
        await expense.populate('category');

        res.json({ message: 'Expense update successfully', updatedExpense: expense});

    }catch(err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router;