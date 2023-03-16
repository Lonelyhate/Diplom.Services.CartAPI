const Router = require("express");
const router = new Router();
const cartController = require("../controllers/CartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, cartController.GetCart);
router.post("/add", authMiddleware, cartController.AddProductToCart);
router.delete("/", authMiddleware, cartController.DeleteAll);
router.post("/plus", authMiddleware, cartController.PlusProduct);
router.post("/minus", authMiddleware, cartController.MinusProduct);

module.exports = router;
