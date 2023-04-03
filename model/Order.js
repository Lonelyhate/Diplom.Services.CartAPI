const { Schema, model } = require("mongoose");

const Order = new Schema({
  userId: { type: Number, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  deliveryType: { type: String, required: true },
  comment: { type: String },
  paymentType: { type: String, required: true },
  cartProduct: [{ type: Schema.Types.ObjectId, ref: "CartProduct" }],
  amount: { type: Number, default: 0, required: true },
  date: { type: Date, default: new Date(), required: true },
  status: { type: String, default: "Новый", required: true },
  numberPhone: { type: String, required: true }
});

module.exports = model("Order", Order);
