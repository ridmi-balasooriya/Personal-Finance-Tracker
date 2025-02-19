const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

//get all expenses
router.get('/', async (req, res) => {
    try{
        const expenses = await Expense.find();
        res.json(expenses);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }   
})

//add new expense
router.post('/', async(req, res) => {
    const{description, amount, date} = req.body;

    if(!description || !amount || !date){
        return res.status(400).json({message: "Missing required fields"});
    }

    try{
        const formatedDate = new Date(date).toISOString().split('T')[0]; //Extract YYYY-MM-DD
        console.log(formatedDate)
        const newExpense = new Expense({description, amount, date: formatedDate}) //Craete Expense object
        await newExpense.save() //Save to MongoDB
        res.status(201).json({message: "Expense added succesfully", newExpense})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router;