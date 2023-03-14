const Cart = require("../model/Cart");
const Product = require("../model/Product");
const Response = require("../model/Response")

class CartController {
    async GetCart(req, res) {
        const response = new Response();
        try {
            const userId = req.user.id;

            const cart = await Cart.findOne({ userId: userId });
            if (!cart) {
                const newCart = await Cart.create({
                    userId: userId,
                    amount: 0,
                });
                newCart.save();
                response.data = newCart;
            } else {
                response.data = cart;
            }

            return res.json(response);
        } catch (e) {
            response.StatusCode = 500;
            response.ErrorMessage = e;
            response.isSuccess = false;
            response.displayMessage = "server error";
            return res.status(500).json(e);
        }
    }
}

module.exports = new CartController();
