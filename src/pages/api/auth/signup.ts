import { NextApiRequest, NextApiResponse } from 'next'
import { setAuthorizationCookie } from '@/utils/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { email, password } = req.body
        const response = await fetch(`${process.env.SERVER_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        if (!response.ok) {
            const json = await response.json()
            console.log(json)
            throw { type: 'SignUpError', detail: json.detail }
        }

        const { access_token } = await response.json()
        setAuthorizationCookie(res, access_token)
        res.status(200).json({ "message": "Signup successful" })
    } catch (error: any) {
        if (error.type === 'SignUpError') {
            res.status(401).json({ error: error.detail })
        } else {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }
}