const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../../constants');

/**
 * GET /api/admin/orders
 * List all marketplace product orders with filtering and pagination
 */
const getOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && Object.values(ORDER_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.buyerId && mongoose.Types.ObjectId.isValid(req.query.buyerId)) {
      query.buyerId = req.query.buyerId;
    }

    if (req.query.orderNumber) {
      query.orderNumber = new RegExp(req.query.orderNumber.trim(), 'i');
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('buyerId', 'name email phone avatar')
      .populate('items.productId', 'title price media')
      .populate('items.artistId', 'displayName location')
      .populate('paymentId', 'amount currency status provider')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Orders retrieved successfully', {
      totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit) || 1,
      orders
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    return sendError(res, 'Failed to retrieve orders', error.message, 500);
  }
};

/**
 * PATCH /api/admin/orders/:id
 * Update order fulfillment or status
 */
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid order ID format.', null, 400);
    }

    const order = await Order.findById(id);
    if (!order) {
      return sendError(res, 'Order not found.', null, 404);
    }

    const { status } = req.body;
    const validationErrors = [];

    if (!status || !Object.values(ORDER_STATUS).includes(status)) {
      validationErrors.push({
        field: 'status',
        message: `Invalid status. Allowed: ${Object.values(ORDER_STATUS).join(', ')}`
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // If order was refunded, synchronize associated payment record if present
    if (status === ORDER_STATUS.REFUNDED && order.paymentId) {
      await Payment.findByIdAndUpdate(order.paymentId, { status: PAYMENT_STATUS.REFUNDED });
    }

    // Notify buyer of fulfillment/order status change
    if (oldStatus !== status) {
      await createNotification({
        userId: order.buyerId,
        type: 'order_status_update',
        title: `Order Update: ${status.toUpperCase()}`,
        message: `Your order #${order.orderNumber} is now marked as '${status}'.`,
        entityId: order._id,
        entityType: 'Order'
      });
    }

    const updatedOrder = await Order.findById(order._id)
      .populate('buyerId', 'name email phone avatar')
      .populate('items.productId', 'title price media')
      .populate('items.artistId', 'displayName location')
      .populate('paymentId', 'amount currency status provider');

    return sendSuccess(res, 'Order updated successfully', updatedOrder);
  } catch (error) {
    console.error('Error in updateOrder:', error);
    return sendError(res, 'Failed to update order', error.message, 500);
  }
};

module.exports = {
  getOrders,
  updateOrder
};
