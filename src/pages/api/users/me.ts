import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const authCookie = req.cookies['Authorization'];
        if (!authCookie) {
            throw { type: 'CredentialsSignin' }
        }

        const response = await fetch(`${process.env.SERVER_URL}/users/me/`, {
            headers: {
                'Authorization': authCookie
            }
        });
        if (!response.ok) {
            throw { type: 'CredentialsSignin' }
        }

        res.status(200).json(await response.json())
    } catch (error: any) {
        if (error.type === 'CredentialsSignin') {
            res.status(401).json({ error: 'Invalid credentials.' })
        } else {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }
}