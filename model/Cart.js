const { Schema, model } = require("mongoose");

const Cart = new Schema({
    userId: { type: Number, required: true, unique: true },
    amount: { type: Number, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

module.exports = model("Cart", Cart)
