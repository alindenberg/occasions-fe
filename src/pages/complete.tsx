import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Return() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        fetch(`/api/checkout?session_id=${sessionId}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    if (status === 'open') {
        return (
            redirect('/')
        )
    }

    if (status === 'complete') {
        return (
            <div className="flex flex-grow h-full w-full text-center border-2 border-green-400 items-center justify-center">
                <div className="dark:text-black bg-gray-200 border-2 border-orange-400 w-1/2 p-6">
                    <p>
                        We appreciate your business! A confirmation email will be sent to {customerEmail}.
                    </p>
                    <p className="sm:pt-6 pt-2">
                        If you have any questions, please email <Link className="text-blue-500 underline" href="mailto:support@occasionalert.me">support@occasionalert.me</Link>.
                    </p>
                    <p className="sm:pt-6 pt-2">
                        <Link className="text-blue-500" href="/">Create an Occasion now</Link>
                    </p>
                </div>
            </div >
        )
    }

    return null;
}