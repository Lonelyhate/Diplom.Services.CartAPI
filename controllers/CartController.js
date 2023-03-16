const Cart = require("../model/Cart");
const Product = require("../model/Product");
const CartProduct = require("../model/CartProduct");
const Response = require("../model/Response");
const CartResponseModel = require("../model/CartResponseModel");
const ProductHelper = require("../helpers/ProductHelper");

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
                return ProductHelper.CopyProduct(item);
            });
            cartResponseModel.countProducts = cart.cartProduct.reduce(
                (sum, object) => sum + object.count,
                0
            );

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

            if (
                !cart.cartProduct.some(
                    (cp) =>
                        cp.product?.id == product.id &&
                        cp.size == productRequest.size
                )
            ) {
                let cartProduct = await CartProduct.create({
                    product: product,
                    size: productRequest.size,
                });
                cart.cartProduct = [...cart.cartProduct, cartProduct];
                await cartProduct.save();
            } else {
                let cartProduct = cart.cartProduct.find(
                    (cp) =>
                        cp.product.id == product.id &&
                        cp.size == productRequest.size
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
            cartResponseModel.products = cart.cartProduct.map((item) => {
                return ProductHelper.CopyProduct(item);
            });
            cartResponseModel.countProducts = cart.cartProduct.reduce(
                (sum, object) => sum + object.count,
                0
            );

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

    async DeleteAll(req, res) {
        const response = new Response();
        const cartResponseModel = new CartResponseModel();
        try {
            const userId = req.user.id;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                response.StatusCode = 404;
                response.isSuccess = false;
                response.displayMessage =
                    "Корзины у пользователя не существует";
                return res.status(404).json(response);
            }

            for (const productCart of cart.cartProduct) {
                await CartProduct.findByIdAndDelete(productCart._id);
            }

            cart.cartProduct = [];
            await cart.save();

            cartResponseModel.amount = 0;
            cartResponseModel.countProducts = 0;
            cartResponseModel.products = [];
            cartResponseModel.userId = userId;
            cartResponseModel._id = cart._id;

            response.data = cartResponseModel;
            response.StatusCode = 200;
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

    async MinusProduct(req, res) {
        const response = new Response();
        const cartResponseModel = new CartResponseModel();
        try {
            const { productid, size } = req.body;
            const userId = req.user.id;

            let cart = await Cart.findOne({ userId: userId }).populate({
                path: "cartProduct",
                populate: { path: "product" },
            });
            if (!cart) {
                response.StatusCode = 404;
                response.isSuccess = false;
                response.displayMessage =
                    "Корзины у пользователя не существует";
                return res.status(404).json(response);
            }

            const cartProduct = cart.cartProduct.find(
                (cp) => cp.size == size && cp.product.id == productid
            );
            if (!cartProduct) {
                response.StatusCode = 404;
                response.isSuccess = false;
                response.displayMessage = "Товар у пользователя не существует";
                return res.status(404).json(response);
            }

            cartProduct.count -= 1;
            if (cartProduct.count == 0) {
                cart.cartProduct = cart.cartProduct.filter(
                    (cp) => cp._id != cartProduct._id
                );
                await cartProduct.deleteOne();
            } else {
                await cartProduct.save();
            }
            await cart.save();

            const cartResponseModel = ProductHelper.CartResponseCopy(cart);
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

    async PlusProduct(req, res) {
        const response = new Response();
        try {
            const { productid, size } = req.body;
            const userId = req.user.id;

            let cart = await Cart.findOne({ userId: userId }).populate({
                path: "cartProduct",
                populate: { path: "product" },
            });
            if (!cart) {
                response.StatusCode = 404;
                response.isSuccess = false;
                response.displayMessage =
                    "Корзины у пользователя не существует";
                return res.status(404).json(response);
            }

            const cartProduct = cart.cartProduct.find(
                (cp) => cp.size == size && cp.product.id == productid
            );
            if (!cartProduct) {
                response.StatusCode = 404;
                response.isSuccess = false;
                response.displayMessage = "Товар у пользователя не существует";
                return res.status(404).json(response);
            }

            cartProduct.count += 1;
            await cartProduct.save();
            await cart.save();

            const cartResponseModel = ProductHelper.CartResponseCopy(cart);
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
