const express = require("express");
const axios = require('axios');

const router = express.Router();
const User = require("../../models/User");


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


module.exports = router;