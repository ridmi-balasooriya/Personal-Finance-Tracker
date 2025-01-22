const exp = require('constants');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { json } = require('stream/consumers');

const dataFilePath = path.join(__dirname, '../data.json');

const getData = () => {
    const data = fs.readFileSync(dataFilePath, 'utf-8'); // Read the file
    return JSON.parse(data) // Parse JSON to JavaScript object
}

const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2)); // Write data to file
}

//Get all expenses
router.get('/', (req, res) => {
    const expenses = getData();
    res.json(expenses)
})

router.post('/', (req, res) => {

    const { description, amount, date } = req.body; // Add the new expense to the array
    if (!description || !amount || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const expenses = getData(); // Fetch current data

    const newExpense = { description, amount, date }; // Create new expense object
    expenses.push(newExpense); // Add the new expense to the array
    saveData(expenses); // Save the updated array back to the file

    // Send a response after successful save
    res.json({ message: 'Expense added successfully', newExpense });
})

module.exports = router;