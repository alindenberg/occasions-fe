import type { NextApiRequest, NextApiResponse } from 'next'

import { getAuthHeaderForToken } from '@/utils/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const accessToken = req.headers.authorization
    const authHeaders = getAuthHeaderForToken(accessToken)
    if (authHeaders?.Authorization === undefined) {
        res.status(401).json({ error: 'Not Authenticated.' })
        return
    }

    // Fetch data from your database or another API
    const response = await fetch(`${process.env.SERVER_URL}/occasions/`, { headers: authHeaders });
    if (!response.ok) {
        if (response.status === 401) {
            res.status(401).json({ error: 'Not Authenticated.' })
        } else {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }

    const occasions = await response.json()
    res.status(200).json(occasions)
}