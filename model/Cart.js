const { Schema, model } = require("mongoose");

const Cart = new Schema({
    userId: { type: Number, required: true, unique: true },
    amount: { type: Number, required: true },
    countProducts: {type: Number, default: 0},
    cartProduct: [{ type: Schema.Types.ObjectId, ref: "CartProduct" }],
});

module.exports = model("Cart", Cart)
