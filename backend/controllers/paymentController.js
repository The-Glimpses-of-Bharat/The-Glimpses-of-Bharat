const Stripe = require("stripe");
const User = require("../models/User");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key");

exports.createOrder = async (req, res) => {
  try {
    const isMock = process.env.STRIPE_SECRET_KEY === "sk_test_placeholder_key" || !process.env.STRIPE_SECRET_KEY;

    if (isMock) {
      console.log("Using Mock Stripe Session (Placeholder keys detected)");
      return res.json({ id: "session_mock_" + Date.now() });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Premium Access",
              description: "Exclusive Research Journals and Archives",
            },
            unit_amount: 49900, // Amount in paise (499 INR)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Frontend URL handling the success redirect
      success_url: `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/research`,
      client_reference_id: req.user.id, // Tie session to user
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Create Session Error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { session_id, is_mock_payment } = req.body;
    const isMock = process.env.STRIPE_SECRET_KEY === "sk_test_placeholder_key" || !process.env.STRIPE_SECRET_KEY;

    if (!isMock) {
      if (is_mock_payment) {
        return res.status(403).json({ message: "Mock payments are disabled in production. Webhooks required." });
      }

      // Real Stripe verification
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== "paid") {
        return res.status(400).json({ message: "Payment not completed" });
      }
      
      // Ensure the session belongs to the user requesting verification
      if (session.client_reference_id !== req.user.id) {
         return res.status(403).json({ message: "Unauthorized verification" });
      }
    } else {
      console.log("Mock verify bypassed real Stripe check.");
    }

    // THE PAYMENT IS LEGIT & VERIFIED (or mocked).
    // Update the user to Premium
    await User.findByIdAndUpdate(req.user.id, {
      role: "premium",
      isPremium: true,
    });

    // Generate a new token with the updated role
    const jwt = require("jsonwebtoken");
    const newToken = jwt.sign(
      { id: req.user.id, role: "premium" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Payment successful! You are now a premium member.",
      token: newToken
    });
  } catch (error) {
    console.error("Stripe Verify Error:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};
