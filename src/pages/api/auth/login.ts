import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { token } = req.body
        const response = await fetch(`${process.env.SERVER_URL}/google-auth?token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Server responded with status ${response.status}: ${errorText}`)
        }

        if (!response.ok) {
            throw { type: 'GoogleSignin', status: response.status }
        }

        const { access_token } = await response.json()
        setAuthorizationCookie(res, access_token)
        res.status(200).json({ "message": "Login successful" })
    } catch (error: any) {
        if (error.type === 'GoogleSignin') {
            res.status(error.status || 401).json({ error: 'Google authentication failed.' })
        } else {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }
}