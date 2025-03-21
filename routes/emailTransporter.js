const router = require('express').Router();
const { Delivery } = require('../models/Delivery');
const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service provider, e.g., Gmail
        auth: {
          user: 'amadhiyapaa@gmail.com', // Your email address
          pass: 'Rainbow2003' // Your email password or app-specific password
        }
      });

      
module.exports = router;





