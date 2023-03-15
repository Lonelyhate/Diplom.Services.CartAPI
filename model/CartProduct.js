const { Schema, model } = require("mongoose");

const CartProduct = new Schema({
    count: { type: Number, default: 1 },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
});

module.exports = model("CartProduct", CartProduct);
