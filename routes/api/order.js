const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const User = require("../../models/User");



// ###### ADMIN RELATED ######

// GET /order/all
// get all orders
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ time: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// GET /order/thisWeek
// GET ALL ORDERS CREATED THIS WEEK
router.get('/thisWeek', async (req, res) => {
    try {
        // Get the current date
        const now = new Date();

        // Calculate the start of the week (Monday)
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Adjust to Monday

        // Calculate the end of the week (Sunday)
        const endOfWeek = new Date(now);
        endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Adjust to Sunday

        const orders = await Order.find({ date: { $gte: startOfWeek, $lte: endOfWeek } }).sort({ time: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: '本周没有订单' });
          }
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// GET /order/:id
// GET AN ORDER BY ID
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


// GET /order/user/:id
// GET ALL ORDERS BY USER ID
router.post('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const orders = await Order.find({ user: userId }).sort({ time: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: '用户未创建订单' });
          }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// ##### USER RELATED #####

// GET /order/user
// GET ALL ORDERS OF CURRENT USER
router.post('/user', async (req, res) => {
    const { openID } = req.body;

    try {
        const user = await User.findOne({ openID });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        const orders = await Order.find({ user: user._id }).sort({ time: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// GET /order/user/thisWeek
// GET ALL THIS WEEK ORDERS OF CURRENT USER
router.post('/user/thisWeek', async (req, res) => {
    const { openID } = req.body;

    try {
        const user = await User.findOne({ openID });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        // Calculate the start of the current week (Monday at 00:00:00)
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
        startOfWeek.setHours(0, 0, 0, 0);

        // Find orders created this week
        const orders = await Order.find({
            user: user._id,
            time: { $gte: startOfWeek }
        }).sort({ time: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// GET /order/user/lastWeek
// GET ALL LAST WEEK ORDERS OF CURRENT USER
router.post('/user/lastWeek', async (req, res) => {
    const { openID } = req.body;

    try {
        const user = await User.findOne({ openID });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        // Calculate the start and end of last week
        const now = new Date();
        const startOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 6)); // Start of last week (Monday)
        startOfLastWeek.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 7); // End of last week (Sunday)
        endOfLastWeek.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

        // Find orders created last week
        const orders = await Order.find({
            user: user._id,
            time: { $gte: startOfLastWeek, $lt: endOfLastWeek }
        }).sort({ time: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// POST /order/new
// CREATE A NEW ORDER
router.post('/new', async (req, res) => {
    const { openID, product, type, quantity, memo } = req.body;

    try {
        const user = await User.findOne({ openID });
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        const newOrder = new Order({
            user: user._id,
            username: user.name,
            province: user.province,
            region: user.region,
            product,
            type,
            quantity,
            memo
        });

        await newOrder.save();
        res.status(201).json({ message: '订单创建成功', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// POST /order/:id
// EDIT AN ORDER BY ID
router.post('/:id', async (req, res) => {
    const { product, type, quantity, memo } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: '订单未找到' });
        }

        order.product = product;
        order.type = type;
        order.quantity = quantity;
        order.memo = memo;

        await order.save();
        res.json({ message: '订单信息已更新', order });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
});


// DELETE /order/:id
// DELETE AN ORDER BY ID
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

module.exports = router;
