const { model } = require('mongoose');
const Category = require('../models/Category');

async function seedCategories() {
    const commonCategories = [
        {name:'Salary', type:'income'},
        {name:'Rental Income', type:'income'},
        {name:'Stock Dividends', type:'income'},
        {name:'FD Interest', type:'income'},
        {name:'Food & Dining', type:'expense'},
        {name:'Transport', type:'expense'},
        {name:'Healthcare', type:'expense'},
        {name:'Shopping', type:'expense'},
        {name:'Housing & Utilities', type:'expense'},
        {name:'Entertainment', type:'expense'},
    ];

    for (let cat of commonCategories){
        const exists = await Category.findOne({ name:cat.name, type:cat.type, user:null});

        if(!exists){
            await Category.create({...cat, user:null});
            console.log(`✅ Category '${cat.name}' created`)
        }
    }
}

module.exports = seedCategories;