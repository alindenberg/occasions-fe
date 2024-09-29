import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const response = await fetch(`${process.env.SERVER_URL}/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (response.ok) {
            return res.status(200).json({ message: 'Verification email sent successfully' });
        } else {
            const error = await response.json();
            return res.status(response.status).json(error);
        }
    } catch (error) {
        console.error('Error resending verification email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}