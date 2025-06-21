import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      res.status(500).json({ message: "Razorpay credentials missing" });
      return;
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create Razorpay order", error });
  }
};

// TODO: Test this endpoint after frontend integration
export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_SECRET) {
      res.status(500).json({ message: "Razorpay secret missing" });
      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify Razorpay payment", error });
  }
};
