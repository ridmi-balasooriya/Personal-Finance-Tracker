const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    type: {type: String, enum: ['expense', 'income'], required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;