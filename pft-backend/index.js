const express = require('express'); // Import Express
const app = express(); // Create an Express app
const PORT = 3000; // Define Port

//Add middleware to log request details
app.use((req, res, next)=>{
    console.log(`${req.method} request made to: ${req.url}`);
    next();
})

//Add middleware to parse incoming JSON data
app.use(express.json());

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