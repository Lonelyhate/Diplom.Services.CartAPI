const { Schema, model } = require("mongoose");

const Product = new Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    size: {type: String, required: true},
    gender: {type: Number, required: true},
    description: {type: String, required: true},
    codeProduct: {type: Number, required: true, unique: true},
    images: {type: String, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    count: {type: Number, required: true}
})

module.exports = model("Product", Product)