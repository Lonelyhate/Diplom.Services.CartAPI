const CartProduct = require("../model/CartProduct");
const CartResponseModel = require("../model/CartResponseModel");
const OrderResponseModel = require("../model/OrderResponseModel");

const copyProduct = (cartHeader) => {
  let product = {
    _id: cartHeader._id,
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
    count: cartHeader.count
  };

  return product;
};

const copyOrder = (item) => {
  const orderModel = new OrderResponseModel();
  orderModel._id = item._id;
  orderModel.userId = item.userId;
  orderModel.firstname = item.firstname;
  orderModel.lastname = item.lastname;
  orderModel.address = item.address;
  orderModel.deliveryType = item.deliveryType;
  orderModel.comment = item.comment;
  orderModel.paymentType = item.paymentType;
  orderModel.amount = item.amount;
  orderModel.date = item.date;
  orderModel.status = item.status;
  orderModel.numberPhone = item.numberPhone;
  orderModel.cartProduct = item.cartProduct.map((el) => {
    return copyProduct(el);
  });

  return orderModel;
};

class ProductHelper {
  CopyProduct(cartHeader) {
    return copyProduct(cartHeader);
  }

  CopyOrder(item) {
    return copyOrder(item);
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
