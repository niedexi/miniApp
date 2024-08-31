const express = require("express");
const jwt = require("jsonwebtoken");

const keys = require("../../config/keys");

const router = express.Router();


// Load user model
const User = require("../../models/User");



// @route   POST api/user/login
// @desc    User login / Return JWT Token
// @access  Public
router.post("/login", (req, res) => {
    
    const email = req.body.email;
  
    // Find user by email
    User.findOne({ wxID }).then(user => {
      // Check for user
      if (!user) {
        // Register to database
      }
  
      
    });
  });
  
  module.exports = router;