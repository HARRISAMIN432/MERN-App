const Order = require('../models/orderModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productSchema');

exports.newOrder = catchAsyncErrors(async(req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    })
})

exports.myOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.find({user : req.user._id})
    res.status(200).json({
        success: true,
        order
    })
})

exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

exports.updateOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) return next(new ErrorHandler('Order not found with this ID', 404));
    if(order.orderStatus === 'Delivered')  return next(new ErrorHandler('You have already delivered this order', 400));
    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    })
    order.orderStatus = req.body.status;
    if(req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        order
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave: false});
}

exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) return next(new ErrorHandler('Order not found with this ID', 404));
    await order.remove();
    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    })
})

