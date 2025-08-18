const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');

//Get all categories
router.get('/', auth, async(req, res) => {
    try{
        const categories = await Category.find().sort({name:1}); //Sort alphabetically
        res.json(categories);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/', auth, async(req, res) => {
    try{

        const {name} = req.body;
        if(!name){
            return res.status(400).json({message: "Category Name is Required.!"})
        }

        const category = new Category({name})
        await category.save();
        res.status(201).json(category);

    }catch(err) {
        res.status(500).json({message: err.message});
    }
})

module.exports = router;