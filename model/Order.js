const { Schema, model } = require("mongoose");

const Order = new Schema({
    userId: {type: Number, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    address: {type: String, required: true},
    deliveryType: {type: String, required: true},
    comment: {type: String},
    paymentType: {type: String, required: true},
    countProducts: {type: Number, default: 0},
    cartProducts: [{type: Schema.Types.ObjectId, ref: "CartProduct"}],
    amount: {type: Number, default: 0}
})

module.exports = model("Order", Order)