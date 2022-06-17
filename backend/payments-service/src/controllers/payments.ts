import { Request, Response, NextFunction } from 'express'
import repository from '../models/paymentsRepository'
import controllerCommons from "commons/api/controllers/controller";
import {TokenProps} from "commons/api/auth";
import {IPayments} from "../models/payments";
import Stripe from 'stripe';
const stripe = new Stripe(`${process.env.STRIPE_PRIVATE_KEY}`, {
    apiVersion: '2020-08-27'
});

async function addPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const token = controllerCommons.getToken(res) as TokenProps
        const payment = req.body as IPayments
        const result = await repository.add(payment, token.accountId)
        res.status(201).json(result)
    } catch (error) {
        console.log(`addMessage: ${error}`)
        res.status(400).end()
    }
}

async function checkout(req: Request, res: Response, next: NextFunction) {
    try {
        const storeItems = new Map([
            [1, { priceInCents: 10000, name: 'Produto Novo' }],
            [2, { priceInCents: 20000, name: 'Produto Velho e mais caro' }]
        ])

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map((item: { id: number; quantity: number; }) => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: storeItem!.name,
                        },
                        unit_amount: storeItem!.priceInCents
                    },
                    quantity: item.quantity
                }
            }),
            success_url: 'http://localhost:3000/payment_success',
            cancel_url: 'http://localhost:3000/payment_cancel'
        })

        res.json({ url: session.url })
    } catch (error) {
        console.log('error checkout', error);
        res.status(400).end()
    }
}

async function webhook(req: Request, res: Response, next: NextFunction) {
    const endpointSecret = process.env.STRIPE_WEBHOOK;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err}`);
        return;
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id);
    console.log('✅ event.type', event.type);

    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
        const stripeObject: Stripe.PaymentIntent = event.data
            .object as Stripe.PaymentIntent;
        console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
    } else if (event.type === 'charge.succeeded') {
        const charge = event.data.object as Stripe.Charge;
        console.log(`💵 Charge id: ${charge.id}`);
    } else {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
}

export default { addPayment, checkout, webhook }