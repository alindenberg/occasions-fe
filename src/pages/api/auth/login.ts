import { setAuthorizationCookie } from '@/utils/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { email, password } = req.body
        const body = new FormData()
        body.append('username', email)
        body.append('password', password)
        const response = await fetch(`${process.env.SERVER_URL}/login`, {
            method: 'POST',
            body: body
        })
        if (!response.ok) {
            throw { type: 'CredentialsSignin' }
        }

        const { access_token } = await response.json()
        setAuthorizationCookie(res, access_token)
        res.status(200).json({ "message": "Login successful" })
    } catch (error: any) {
        if (error.type === 'CredentialsSignin') {
            res.status(401).json({ error: 'Invalid credentials.' })
        } else {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }
}