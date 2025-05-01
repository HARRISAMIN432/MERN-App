const Product = require('../models/productSchema');

exports.createProduct = async(req, res, next) => {
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        Product
    })
} 

exports.getAllProducts = (req, res) => {
    res.status(200).json({
        id: 29,
        name: "Cooking oil",
        price: 500,
        quantity: 5
    })
} 