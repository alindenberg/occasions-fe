import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            try {
                // Create Checkout Sessions from body params.
                const response = await fetch(`${process.env.SERVER_URL}/checkout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': req?.cookies?.Authorization || 'None',
                        'Content-Type': 'application/json',
                    },
                    body: req.body,
                });
                if (!response.ok) {
                    throw new Error('Failed to create checkout session');
                }
                const data = await response.json();
                res.send({ clientSecret: data.client_secret });
            } catch (err: any) {
                res.status(err.statusCode || 500).json(err.message);
            }
            break;
        case "GET":
            try {
                const session =
                    await stripe.checkout.sessions.retrieve(req.query.session_id);

                res.send({
                    status: session.status,
                    customer_email: session.customer_details.email
                });
            } catch (err: any) {
                res.status(err.statusCode || 500).json(err.message);
            }
            break;
        default:
            res.setHeader('Allow', req.method!!);
            res.status(405).end('Method Not Allowed');
    }
}