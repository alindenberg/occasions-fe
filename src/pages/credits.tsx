import { useState } from 'react';
import { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!!);

export default function CheckoutPage() {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const fetchClientSecret = useCallback(() => {
        // Create a Checkout Session
        return fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({ quantity }),
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    }, [quantity]);

    const options = { fetchClientSecret };

    return (
        <div className="flex flex-grow justify-center p-4 items-center">
            <div className="md:w-1/2 w-2/3">

                {!isCheckingOut &&
                    <div className="dark:text-black text-center bg-gray-100 border-2 border-orange-400 p-4">
                        <h1 className="text-xl">Purchase Credits</h1>
                        <p className="text-lg">Select the quantity of credits you would like to purchase</p>
                        <div className="flex flex-row justify-evenly items-center py-4">
                            <select
                                value={quantity}
                                onChange={(e) => {
                                    const quantity = parseInt(e.target.value);
                                    setQuantity(quantity)
                                }}
                                className="w-1/4 p-2 border-2 border-orange-400"
                            >
                                {Array.from(Array(10).keys()).map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <button
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setIsCheckingOut(true)}>
                                Checkout
                            </button>
                        </div>
                    </div>
                }
                {isCheckingOut && <div id="checkout">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => setIsCheckingOut(false)}>
                        Return to Cart
                    </button>
                    <div className="border-2 border-orange-400">
                        <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={options}
                        >
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    </div>
                </div>}
            </div>
        </div >
    )
}