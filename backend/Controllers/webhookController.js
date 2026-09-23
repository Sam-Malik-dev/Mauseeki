const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../Models/User'); // adjust path/name to match yours

const webhook = async (req, res) => {
  let event = req.body; // raw body, since express.raw() is used on this route

  // If you have STRIPE_WEBHOOK_SECRET, verify signature (safer)
  // If not set up yet, this block will just use the raw event as-is
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await User.findByIdAndUpdate(session.metadata.userId, {
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        subscriptionStatus: 'active'
      });
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { subscriptionStatus: 'active' }
      );
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { subscriptionStatus: 'past_due' }
      );
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { subscriptionStatus: 'canceled' }
      );
      break;
    }
  }

  res.json({ received: true });
};

module.exports = webhook;