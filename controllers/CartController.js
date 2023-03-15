const Cart = require("../model/Cart");
const Product = require("../model/Product");
const CartProduct = require("../model/CartProduct");
const Response = require("../model/Response");
const CartResponseModel = require("../model/CartResponseModel");

class CartController {
    async GetCart(req, res) {
        const response = new Response();
        try {
            const userId = req.user.id;
            const cartResponseModel = new CartResponseModel();
            let cart = await Cart.findOne({ userId: userId }).populate({
                path: "cartProduct",
                populate: { path: "product" },
            });
            if (!cart) {
                cart = await Cart.create({
                    userId: userId,
                    amount: 0,
                });
                await cart.save();
            }

            cartResponseModel._id = cart._id;
            cartResponseModel.userId = cart.userId;
            cartResponseModel.amount = cart.cartProduct.reduce(
                (sum, object) => sum + object.count * object.product.price,
                0
            );
            cartResponseModel.products = cart.cartProduct.map((item) => {
                const product = item.product;
                product.count = item.count;
                return product;
            });
            cartResponseModel.countProducts = cart.cartProduct.reduce((sum, object) => sum + object.count, 0) 

            response.data = cartResponseModel;

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

    async AddProductToCart(req, res) {
        const response = new Response();
        const cartResponseModel = new CartResponseModel();
        try {
            const productRequest = req.body;
            const userId = req.user.id;

            let product = await Product.findOne({ id: productRequest.id });
            if (!product) {
                product = await Product.create({
                    id: productRequest.id,
                    name: productRequest.name,
                    price: productRequest.price,
                    size: productRequest.size,
                    gender: productRequest.gender,
                    description: productRequest.description,
                    codeProduct: productRequest.codeProduct,
                    images: productRequest.images,
                    category: productRequest.category,
                    brand: productRequest.brand,
                });
                await product.save();
            }

            let cart = await Cart.findOne({ userId: userId }).populate({
                path: "cartProduct",
                populate: { path: "product" },
            });

            if (!cart.cartProduct.some((cp) => cp.product.id == product.id)) {
                let cartProduct = await CartProduct.create({
                    product: product,
                });
                cart.cartProduct = [...cart.cartProduct, cartProduct];
                await cartProduct.save();
            } else {
                let cartProduct = cart.cartProduct.find(
                    (cp) => cp.product.id == product.id
                );
                cartProduct.count += 1;
                await cartProduct.save();
            }
            await cart.save();

            cartResponseModel._id = cart._id;
            cartResponseModel.amount = cart.cartProduct.reduce(
                (sum, object) => sum + object.count * object.product.price,
                0
            );
            cartResponseModel.userId = cart.userId;
            cartResponseModel.products = cartResponseModel.products =
                cart.cartProduct.map((item) => {
                    let product = item.product;
                    product.count = item.count;
                    return item;
                });
            cartResponseModel.countProducts = cart.cartProduct.reduce((sum, object) => sum + object.count, 0) 

            response.data = cartResponseModel;
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

module.exports = new CartController();
