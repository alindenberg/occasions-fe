import type { NextApiRequest, NextApiResponse } from 'next'
import { getAccessToken } from '@/utils/auth'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { feedback } = req.body
            const accessToken = await getAccessToken(req, res);

            // Add Authorization header if session exists
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`
            }

            // Send the feedback to the server
            const response = await fetch(`${process.env.SERVER_URL}/feedback`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ feedback }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit feedback to server')
            }
            res.status(200).json({ message: 'Feedback received' })
        } catch (error) {
            res.status(500).json({ message: 'Error submitting feedback' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}