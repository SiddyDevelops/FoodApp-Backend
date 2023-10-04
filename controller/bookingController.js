const SK = require('../secrets').SECRET_KEY;
const stripe = require('stripe')(SK);
const planModel = require('../models/planModel');
const userModel = require('../models/userModel');

module.exports.createSession = async function createSession(req,res) {
    try{
        let userId = req.id;
        let planId = req.params.id;
        let host = req.get("host");

        const user = await userModel.findById(userId);
        const plan = await planModel.findById(planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_refernce_id: plan.id,
            line_items: [
                {
                    name: plan.name,
                    description: plan.description,
                    amount: plan.price * 100,
                    currency: 'inr',
                    quantity: 1
                }
            ],
            success_url: `${req.protocol}://${host}/profile`,
            cancel_url: `${req.protocol}://${host}/profile`
        });
        res.status(200).json({
            status: 'success',
            session
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}