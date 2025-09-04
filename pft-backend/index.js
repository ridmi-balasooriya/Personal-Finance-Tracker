const express = require('express'); // Import Express
const cors = require('cors') // Important for connecting React with Express

const dotenv = require('dotenv');
const connectDB = require('./routes/db') //MongoDB connection

// Import routes
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

//Import seeding files
const seedCategories = require('./seed/seedCategories');

require('dotenv').config();

const app = express(); // Create an Express app


//Add middleware to log request details
app.use((req, res, next)=>{
    console.log(`${req.method} request made to: ${req.url}`);
    next();
})

//Add middleware to parse incoming JSON data
app.use(cors());
app.use(express.json());

//Route
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// Define basic route
app.get('/', (req, res) => {
    res.send('Hello, Ridmi! Your tracker is running!');
})

const PORT = process.env.PORT || 5000

connectDB().then(async () => {
    await seedCategories();
    
    // Start the Server
    app.listen(PORT, ()=> {
        console.log(`Server is running on  http://localhost:${PORT}`);
    })
})
