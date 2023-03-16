const CartResponseModel = require("../model/CartResponseModel");

const copyProduct = (cartHeader) => {
    let product = {
        id: cartHeader.product.id,
        name: cartHeader.product.name,
        price: cartHeader.product.price,
        gender: cartHeader.product.gender,
        description: cartHeader.product.description,
        codeProduct: cartHeader.product.codeProduct,
        images: cartHeader.product.images,
        category: cartHeader.product.category,
        brand: cartHeader.product.brand,
        size: cartHeader.size,
        count: cartHeader.count,
    };

    return product;
};

class ProductHelper {
    CopyProduct(cartHeader) {
        return copyProduct(cartHeader);
    }

    CartResponseCopy(cart) {
        let cartResponseModel = new CartResponseModel();
        cartResponseModel._id = cart._id;
        cartResponseModel.amount = cart.cartProduct.reduce(
            (sum, object) => sum + object.count * object.product.price,
            0
        );
        cartResponseModel.userId = cart.userId;
        cartResponseModel.products = cart.cartProduct.map((item) => {
            return copyProduct(item);
        });
        cartResponseModel.countProducts = cart.cartProduct.reduce(
            (sum, object) => sum + object.count,
            0
        );
        return cartResponseModel;
    }
}

module.exports = new ProductHelper();
