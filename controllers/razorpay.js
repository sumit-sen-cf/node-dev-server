const Razorpay = require("razorpay");
const response = require("../common/response.js");
const razorpayPaymentModel = require("../models/razorpayPaymentModel.js");

const razorpay = new Razorpay({
    key_id: "rzp_test_rSd0QdC5SJrnCq",
    key_secret: "KYsmuS180WeDCuwAIinXX0ze"
})


// exports.createOrder = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         // Create a new order with Razorpay
//         const razorpayOrder = await razorpay.orders.create({
//             amount: amount * 100, // Razorpay accepts amount in paisa (1 INR = 100 paisa)
//             currency: 'INR',
//             receipt: 'receipt_' + Date.now(),
//             payment_capture: 1 // Automatically capture the payment
//         });
//         // Store the order details in MongoDB
//         const newOrder = new razorpayPaymentModel({
//             amount: amount,
//             order_id: razorpayOrder.id,
//             status: 'created'
//         });
//         await newOrder.save();
//         res.json({ order_id: razorpayOrder.id, amount: amount });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error creating order' });
//     }
// };

// exports.processPayment = async (req, res) => {
//     try {
//         const { order_id } = req.body;
//         // Verify the payment signature
//         const generatedSignature = razorpay.utils.generateSignature(order_id, 'KYsmuS180WeDCuwAIinXX0ze');
//         if (generatedSignature !== razorpay_signature) {
//             throw new Error('Invalid signature');
//         }
//         // Update the order status in MongoDB
//         const order = await razorpayPaymentModel.findOneAndUpdate({ order_id: order_id }, { status: 'paid' }, { new: true });
//         // Handle the payment success logic here
//         console.log('Payment successful:', order);
//         res.json({ status: 'success' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error processing payment' });
//     }
// }

exports.processPayment = async (req, res) => {
    try {
        const { order_id, amount } = req.body;

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amount * 100, // Razorpay expects amount in smallest currency unit (e.g., paise for INR)
            currency: 'INR', // Change currency as per your requirements
            receipt: order_id,
            payment_capture: 1 // Automatically capture payments
        });

        // Store payment details in MongoDB
        const payment = new razorpayPaymentModel({
            order_id,
            amount,
            order_id: razorpayOrder.id
        });
        await payment.save();

        res.json({ order_id: razorpayOrder.id });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Error creating payment' });
    }
}