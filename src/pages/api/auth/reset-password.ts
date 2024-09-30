import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { password, hash } = req.body
        const response = await fetch(`${process.env.SERVER_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "new_password": password,
                "reset_hash": hash
            }
            )
        })
        if (!response.ok) {
            throw new Error("Failed to request password reset")
        }
        res.status(200).json({ "message": "Reset request successful" })
    } catch (error: any) {
        res.status(500).json({ error: 'Something went wrong.' })
    }
}