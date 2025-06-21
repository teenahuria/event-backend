// routes/payment.js
const express = require('express');
const router = express.Router();
const { createOrdersForPendingPayments } = require('../controllers/paymentController');

router.get('/sync-orders', createOrdersForPendingPayments);
// POST /api/payments/new
router.post('/api/payments/new', async (req, res) => {
  const { event_id, user_id, amount, upi_id } = req.body;

  const payment = await Payment.create({
    event_id,
    user_id,
    upi_id,
    amount_due: amount,
    payment_status: 'PENDING',
    amount_paid: 0,
    payment_mode: 'UPI'
  });

  res.json({ success: true, payment });
});

module.exports = router;
