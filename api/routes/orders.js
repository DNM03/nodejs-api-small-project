const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const OrderController = require("../controllers/orders");

router.get("/", checkAuth, OrderController.order_get_all);

router.post("/", checkAuth, OrderController.order_create_order);

router.get("/:orderId", checkAuth, OrderController.order_get_order);

router.patch("/:orderId", checkAuth, OrderController.order_patch_order);

router.delete("/:orderId", checkAuth, OrderController.order_delete_order);

module.exports = router;
