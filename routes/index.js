const Router = require("express");
const router = new Router();
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");

router.use("/cart", cartRouter);
router.use("/order", orderRouter);

module.exports = router;
