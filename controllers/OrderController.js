const ProductHelper = require("../helpers/ProductHelper");
const CartProduct = require("../model/CartProduct");
const Order = require("../model/Order");
const OrderResponseModel = require("../model/OrderResponseModel");
const Response = require("../model/Response");

class OrderController {
  async MakeOrder(req, res) {
    const response = new Response();
    try {
      const userId = req.user.id;
      const order = req.body;
      order.userId = userId;

      const cp = order.cartProduct;
      order.cartProduct = [];
      for (const item of cp) {
        const cartP = await CartProduct.findById(item._id);
        order.cartProduct.push(cartP);
      }
      const orderDb = await Order.create({
        ...order,
        cartProduct: [...order.cartProduct]
      });
      await orderDb.save();
      const OR = await orderDb.populate({
        path: "cartProduct",
        populate: { path: "product" }
      });
      response.StatusCode = 200;
      response.data = ProductHelper.CopyOrder(OR);
      response.isSuccess = true;
      return res.json(response);
    } catch (e) {
      console.log(e);
      response.StatusCode = 500;
      response.ErrorMessage = e;
      response.isSuccess = false;
      response.displayMessage = "server error";
      return res.status(500).json(e);
    }
  }

  async GetOrdersByUser(req, res) {
    const response = new Response();
    try {
      const userId = req.user.id;

      const orders = await Order.find({ userId }).populate({
        path: "cartProduct",
        populate: { path: "product" }
      });

      console.log(orders);

      const responseOrders = [];
      for (const item of orders) {
        const orderModel = ProductHelper.CopyOrder(item);
        responseOrders.push(orderModel);
      }

      response.StatusCode = 200;
      response.data = responseOrders;
      response.isSuccess = true;
      return res.json(response);
    } catch (e) {
      console.log(e);
      response.StatusCode = 500;
      response.ErrorMessage = e;
      response.isSuccess = false;
      response.displayMessage = "server error";
      return res.status(500).json(e);
    }
  }
}

module.exports = new OrderController();
