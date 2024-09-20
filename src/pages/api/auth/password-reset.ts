import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { email } = req.body
        const response = await fetch(`${process.env.SERVER_URL}/request-password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        if (!response.ok) {
            throw new Error("Failed to request password reset")
        }
        res.status(200).json({ "message": "Reset request successful" })
    } catch (error: any) {
        res.status(500).json({ error: 'Something went wrong.' })
    }
}