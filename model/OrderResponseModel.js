class OrderResponseModel {
    _id
    userId
    firstname
    lastname
    address
    deliveryType
    comment
    paymentType
    cartProduct = []
    amount
    date
    status
    numberPhone
}

module.exports = OrderResponseModel;