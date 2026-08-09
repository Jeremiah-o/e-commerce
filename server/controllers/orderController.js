import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        res.status(404);
        throw new Error("One of the products no longer exists");
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(
          `${product.name} only has ${product.stock} item(s) left in stock`,
        );
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const shippingPrice =
      itemsPrice > 5000 ? 0 : Number((itemsPrice * 0.1).toFixed(2));
    const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(res.statusCode).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(res.statusCode).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }

    res.json(order);
  } catch (error) {
    res.status(res.statusCode).json({
      message: error.message,
    });
  }
};

export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.isPaid) {
      res.status(400);
      throw new Error("Order is already marked as paid");
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Processing";

    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      emailAddress: req.body.emailAddress,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(res.statusCode).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (status === "Cancelled") {
      order.isDelivered = false;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user","name email")
      .populate("orderItems.product", "name image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(res.statusCode).json({
      message: error.message,
    });
  }
};
