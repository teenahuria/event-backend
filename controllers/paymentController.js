require('dotenv').config();
const { Payment } = require('../models/payment');
const Razorpay = require('razorpay');

// ✅ Razorpay instance (should be before use)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_yourKeyHere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'yourKeySecretHere'
});

// ✅ Controller function — define only once
async function createOrdersForPendingPayments(req, res) {
  try {
    const pendingPayments = await Payment.findAll({
      where: { payment_status: 'PENDING' },
      limit: 5
    });

    const results = [];

    for (let payment of pendingPayments) {
      const amountInPaise = parseFloat(payment.amount_due) * 100;

      console.log(`🧾 Creating order for Payment ID ${payment.payment_id}, Amount: ${amountInPaise} paise`);

      if (amountInPaise < 100) {
        console.warn(`⚠️ Skipped payment ID ${payment.payment_id}: amount too low`);
        continue;
      }

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${payment.payment_id}`,
        notes: {
          event_id: payment.event_id,
          user_id: payment.user_id,
          payment_mode: payment.payment_mode
        }
      });

      // Save Razorpay order ID to DB
      payment.transaction_id = order.id;
      await payment.save();

      results.push({
        local_payment_id: payment.payment_id,
        razorpay_order_id: order.id,
        amount: order.amount
      });
    }

    res.json({
      success: true,
      message: "Orders created for pending payments",
      data: results
    });

  } catch (error) {
    console.error('🔴 Error syncing payments:', error);
    res.status(500).json({
      success: false,
      message: "Failed to sync payments",
      error: error.message || error
    });
  }
}


module.exports = { createOrdersForPendingPayments };
