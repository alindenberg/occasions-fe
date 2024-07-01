import { getAuthHeaders } from '@/utils/utils';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await fetch(`${process.env.SERVER_URL}/users/me`, { headers: getAuthHeaders(req) });
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