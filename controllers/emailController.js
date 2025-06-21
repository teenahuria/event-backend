const { User } = require('../models/users');
const sendMail = require('../utils/sendMail');
const bcrypt = require('bcrypt');


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpExpiryUTC = new Date(Date.now() + 60 * 60 * 1000);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const otpExpiryIST = new Date(otpExpiryUTC.getTime() + istOffset);
  const otpExpiryISTISOString = otpExpiryIST.toISOString();

  user.otp = otp;
  user.otp_expiry = otpExpiryISTISOString;
  await user.save();

  console.log(`Generated OTP for ${email}: ${otp}`);
  console.log("OTP Expiry Time (UTC):", otpExpiryISTISOString);
  console.log("Current Time (UTC):", new Date().toISOString());

  await sendMail(
    email,
    'One-Time Password (OTP) for Password Reset',
    `Dear ${user.name},

We received a request to reset the password for your account associated with this email address.

Your One-Time Password (OTP) is: ${otp}

Please note that this OTP is valid for 1 hour from the time of receipt. For security reasons, do not share this OTP with anyone.

If you did not request a password reset, please ignore this email or contact our support team immediately.

Thank you,
[NIC] Support Team`
  );

  return res.json({ message: 'OTP sent to your email' });
};

// Verify OTP: Check if the OTP is valid and not expired
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  console.log("Stored OTP:", user.otp);
  console.log("Received OTP:", otp);
  console.log("OTP Expiry Time (UTC):", user.otp_expiry?.toISOString());
  console.log("Current Time (UTC):", new Date().toISOString());

  const isOtpValid = user.otp === otp.toString();
  const expiryDate = new Date(user.otp_expiry);
  const currentDate = new Date();

  const isOtpExpired = currentDate > expiryDate;

  console.log("Is OTP valid?", isOtpValid);
  console.log("Is OTP expired?", isOtpExpired);

  if (!isOtpValid || isOtpExpired) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = null;
  user.otp_expiry = null;
  await user.save();

  return res.json({ message: 'OTP verified. You can now reset your password.' });
};

// ✅ Reset password: Hash and update the new password
exports.resetPassword = async (req, res) => {
  console.log("calling reset--")
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(email,newPassword,hashedPassword)
    await user.update({
      password: hashedPassword,
      otp: null,
      otp_expiry: null
    });

    res.status(200).json({ message: "Password reset successful." });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
};
