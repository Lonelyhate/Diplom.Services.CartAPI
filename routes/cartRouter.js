const Router = require('express');
const router = new Router();
const cartController = require("../controllers/CartController");
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/", authMiddleware, cartController.GetCart)

module.exports = router;