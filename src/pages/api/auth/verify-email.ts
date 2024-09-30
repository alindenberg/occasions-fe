import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const response = await fetch(`${process.env.SERVER_URL}/verify-email/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Email verified successfully' });
        } else {
            return res.status(response.status).json({ success: false, error: data.detail || 'Failed to verify email' });
        }
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ success: false, error: 'An error occurred while verifying email' });
    }
}
