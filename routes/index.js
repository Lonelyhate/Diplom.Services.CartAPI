const Router = require("express");
const router = new Router();
const cartRouter = require("./cartRouter");

router.use("/cart", cartRouter);

module.exports = router;
