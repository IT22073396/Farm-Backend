const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const crypto = require("crypto");
const { sendEmail } = require("./email_utils");
const bcrypt = require('bcrypt');


router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    

    const resetPasswordLink = `http://localhost:5173/reset-password-confirm/${resetToken}`;

    await sendEmail("Password Reset","udulacode@outlook.com", [email], `Password reset link: ${resetPasswordLink}` )
    res.status(200).json({ message: "Password reset instructions sent to your email." });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

router.post("/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      // Find user by reset token
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
  
      // Update password
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });
  
module.exports = router;
