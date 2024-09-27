import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { feedback } = req.body
            // TODO: Save feedback to database or send to an external service
            console.log('Received feedback:', feedback)
            res.status(200).json({ message: 'Feedback received' })
        } catch (error) {
            res.status(500).json({ message: 'Error submitting feedback' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}