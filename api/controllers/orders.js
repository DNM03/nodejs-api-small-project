const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");

exports.order_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name _id price")
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.order_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return order.save();
    })
    .then((result) => {
      if (result) {
        console.log(result);
        res.status(201).json({
          message: "Handling Post requests to /orders",
          createdOrder: result,
        });
      }
    })
    .catch((err) => {
      console.error("Error creating order:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.order_get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        const response = {
          order: {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.order_patch_order = (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.findOneAndUpdate({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.order_delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      if (result.n === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
