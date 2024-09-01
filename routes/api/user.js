const express = require("express");
const axios = require('axios');

const router = express.Router();
const User = require("../../models/User");


router.get('/', (req, res) => {
  res.send('Hello World!')
});


// GET /api-user/all
// GET ALL USERS
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
});


//LOGIN
router.post('/login', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
      params: {
        appid: 'wxb2c44787e307336d',
        secret: '8e233ecb175bedd29acffcddfe0100a7',
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid } = response.data;

    if (!openid) {
      return res.status(400).json({ message: '登录失败' });
    }

    // 检查用户是否已经注册
    const user = await User.findOne({ openID: openid });

    res.json({
      openid,
      isRegistered: !!user
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
});


//REGISTER
router.post('/register', async (req, res) => {
  const { openID, name, phone, province, region } = req.body;

  try {
    const newUser = new User({
      openID,
      name,
      phone,
      province,
      region
    });

    await newUser.save();
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    res.status(500).json({ message: '注册失败', error });
  }
});


//GET CURRENT USER PROFILE
router.post('/get', async (req, res) => {
  const { openID } = req.body;

  try {
    const user = await User.findOne({ openID });
    if (user) {
      res.json({
        name: user.name,
        phone: user.phone,
        province: user.province,
        region: user.region
      });
    } else {
      res.status(404).json({ message: '用户未找到' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
});


//EDIT USER PROFILE
router.post('/edit', async (req, res) => {
  const { openID, name, phone, province, region } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { openID },
      { name, phone, province, region },
      { new: true }
    );

    if (user) {
      res.json({ message: '用户信息更新成功' });
    } else {
      res.status(404).json({ message: '用户未找到' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
});



module.exports = router;