const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const payment = async (req, res) => {
  const { userId, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        { price: process.env.STRIPE_MONTHLY_PRICE_ID, quantity: 1 }
      ],
      success_url: `${process.env.CLIENT_URL}/subscription-success`,
      cancel_url: `${process.env.CLIENT_URL}/subscription-cancel`,
      metadata: { userId }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = payment;