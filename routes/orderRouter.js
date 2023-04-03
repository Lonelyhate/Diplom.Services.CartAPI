const Router = require("express");
const router = new Router();
const orderController = require("../controllers/OrderController");
const authModdleware = require("../middlewares/authMiddleware");

router.post("/", authModdleware, orderController.MakeOrder);
router.get("/", authModdleware, orderController.GetOrdersByUser);

module.exports = router;
