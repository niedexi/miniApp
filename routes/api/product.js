const express = require('express');
const router = express.Router();


const Item = require('../../models/Item');
const Bundle = require('../../models/Bundle');


// -----ITEM-----


// GET /product/item
// get all items
router.get('/item', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
});

// GET /prodcut/item/:id
// get an item by ID
router.get('/item/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
});



// -----BUNDLE-----

// GET /product/bundle
// get all bundles
router.get('/bundle', async (req, res) => {
    try {
        const bundles = await Bundle.find();
        res.json(bundles);
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
});


// GET /prodcut/bundle/:id
// get bundle by id
router.get('/bundle/:id', async (req, res) => {
    try {
        const bundle = await Bundle.findById(req.params.id);
        if (!bundle) {
            return res.status(404).json({ message: 'bundle not found' });
        }

        res.json(bundle);
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
});


module.exports = router;