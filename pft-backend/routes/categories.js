const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');

//Get all categories
router.get('/', auth, async(req, res) => {
    try{
        const {type} = req.query;
        let filter = {};

        if (type){
            filter.type = type.toLowerCase();
        }

        const categories = await Category.find({
            ...filter,
            $or: [
                {user:null}, // common
                {user: req.user._id} // personal
            ]
        }).sort({name:1}); //Sort alphabetically

        res.json(categories);

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/', auth, async(req, res) => {
    try{

        const {name, type} = req.body;
        if(!name){
            return res.status(400).json({message: "Category Name is Required.!"})
        }

        if(!['expense', 'income'].includes(type.toLowerCase())){
            return res.status(400).json({message: "Type must be either expense or income"})
        }

        const category = new Category({
            name, 
            type: type.toLowerCase(),
            user: req.user._id, // belongs only to this user
        });

        await category.save();
        res.status(201).json(category);

    }catch(err) {
        res.status(500).json({message: err.message});
    }
})

module.exports = router;