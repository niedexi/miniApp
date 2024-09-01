const express = require('express');
const router = express.Router();


const Order = require('../../models/Order');
const User = require("../../models/User");




// GET /api-order/all
// get all orders
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ time: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// POST /api-order/user
// get all order by user
router.post('/user', async (req, res) => {
    const { openID } = req.body;

    try {
        const user = await User.findOne({ openID });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        const orders = await Order.find({ user: user._id }).sort({ time: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// POST /api-order/new
// create new order
router.post('/new', async (req, res) => {
    const { openID, product, quantity, memo } = req.body;

    try {
        const user = await User.findOne({ openID });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        const newOrder = new Order({
            user: user._id,
            name: user.name,
            phone: user.phone,
            province: user.province,
            region: user.region,
            product,
            quantity,
            memo
        });

        await newOrder.save();
        res.status(201).json({ message: '订单创建成功', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// GET /api-order/:id
// get order by id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: '订单未找到' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// DELETE  /api-order/:id
// delete order by id
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: '订单未找到' });
        }

        res.json({ message: '订单已删除' });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// POST /api-order/edit/:id
// edit order by id
router.post('/edit/:id', async (req, res) => {
    const { product, quantity, memo } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: '订单未找到' });
        }

        order.product = product;
        order.quantity = quantity;
        order.memo = memo;

        await order.save();
        res.json({ message: '订单信息已更新', order });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


module.exports = router;
