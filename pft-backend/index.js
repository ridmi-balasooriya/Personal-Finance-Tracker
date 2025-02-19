const express = require('express'); // Import Express
const expenseRoute = require('./routes/expenses')
const cors = require('cors') // Important for connecting React with Express
const app = express(); // Create an Express app
const PORT = 5000; // Define Port
const db = require('./routes/db') //MongoDB connection

//require('dotenv').config(); ENV Variables.


//Add middleware to log request details
app.use((req, res, next)=>{
    console.log(`${req.method} request made to: ${req.url}`);
    next();
})

//Add middleware to parse incoming JSON data
app.use(cors());
app.use(express.json());

//Route
app.use('/expenses', expenseRoute);

// Define basic route
app.get('/', (req, res) => {
    res.send('Hello, Ridmi! Your tracker is running!');
})

// Start the Server
app.listen(PORT, ()=> {
    console.log(`Server is running on  http://localhost:${PORT}`);
})


const expensesRouter = require('./routes/expenses');
app.use('/expenses', expensesRouter);