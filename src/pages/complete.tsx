import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Complete() {
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
            <div className="flex flex-grow text-center items-center justify-center ">
                <div className="dark:text-black bg-gray-100 border-2 border-orange-400 w-full max-w-md p-6 mx-4 rounded-lg shadow-md">
                    <p className="mb-4">
                        We appreciate your business! A confirmation email will be sent to {customerEmail}.
                    </p>
                    <p className="mb-4">
                        If you have any questions, please email <Link className="text-blue-500 underline" href="mailto:support@mg.occasionalerts.com">support@mg.occasionalerts.com</Link>
                    </p>
                    <p>
                        <Link className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block" href="/?openCreateModal=true">Create an Occasion now</Link>
                    </p>
                </div>
            </div>
        )
    }

    return null;
}