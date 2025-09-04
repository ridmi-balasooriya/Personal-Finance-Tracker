const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/authMiddleware');
const dayjs = require('dayjs');

router.get('/', auth, async (req, res) => {
    
    try{
        const userId = req.user.id;
        const {
            category,       // categoryId
            minAmount, 
            maxAmount, 
            description,    // exact match
            keyword,        // search keyword
            isRecurring, 
            filter,         // weekly, monthly, quarterly, yearly
            year,           // specific year
            month,          // specific month (1-12)
            quarter,        // specific quarter (1-4)
            startDate,      // custom date range start
            endDate         // custom date range end
        } = req.query;

        const query = { userId };
        
        // Category
        if (category) query.category = category;

        // Amount range
        if (minAmount || maxAmount){
            query.amount = {};

            if(minAmount) query.amount.$gte = Number(minAmount);
            if(maxAmount) query.amount.$lte = Number(maxAmount);
        }

        // Description exact match
        if (description){
            
            query.description = { $regex: new RegExp(`^${description}$`, 'i')};

        // Keyword in description
        }else if (keyword){
            query.description = { $regex: keyword, options:'i'};
        }

        if (isRecurring !== undefined){
            query.isRecurring = isRecurring === 'true';
        }

        // Date Filters
        let start, end;

        // Priority 1: Custom date range (most specific)
        if (startDate && endDate) {
            start = dayjs(startDate).startOf('day');
            end = dayjs(endDate).endOf('day');

        // Priority 2: Specific year/month/quarter
        }else if (year && month){

            start = dayjs(`${year}-${month}-01`).startOf('month');
            end = dayjs(start).endOf('month');

        }else if (year && quarter){

            start = dayjs().year(year).quarter(quarter).startOf('quarter');
            end =  dayjs(start).endOf('quarter');

        }else if (year){

            start = dayjs(`${year}-01-01`).startOf('year');
            end = dayjs(`${year}-12-31`).endOf('year');
        
        // Priority 3: Relative quick filter
        }else if (filter) {
            const today = dayjs();
            
            switch(filter) {
                case "weekly":
                    start = today.startOf('week').add(1, 'day'); // Monday
                    end = start.add(6, 'day'); // Sunday
                    break;

                case "monthly":
                    start = today.startOf('month');
                    end = today.endOf('month');
                    break;
                
                case "quarterly":
                    start = today.startOf('quarter');
                    end = today.endOf('quarter');
                    break;

                case "yearly":
                    start = today.startOf('year');
                    end = today.endOf('year');
                    break;
            }
        }

        if(start && end){
            query.date = { $gte: start.toDate(), $lte: end.toDate() };
        }

        const incomes = await Income.find(query).populate('category', 'name').sort({ date: -1 });

        res.json(incomes);

    }catch(err){
        res.status(500).json({ message: err.message});
    }

});

//add new income
router.post('/', auth, async(req, res) => {
    const {description, amount, date, category} = req.body;
    const userId = req.user.id; // Get user ID from token

    if(!description || !amount || !date || !category){
        return res.status(400).json({message: "Missing required fields"});
    }

    try{
        const formatedDate = new Date(date).toISOString().split('T')[0]; //Extract YYYY-MM-DD
        console.log(formatedDate)
        const newIncome = new Income({ userId, description, amount, date: formatedDate, category}) //Craete Income object
        await newIncome.save() //Save to MongoDB

        //Populate category to send back
        await newIncome.populate('category');

        res.status(201).json({message: "Income added succesfully", newIncome})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router;