import type { NextApiRequest, NextApiResponse } from 'next'

import { getAuthHeaders } from '@/utils/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Fetch data from your database or another API
    try {
        const response = await fetch(`${process.env.SERVER_URL}/occasions/`, { headers: getAuthHeaders(req) });
        if (!response.ok) {
            if (response.status === 401) {
                res.status(401).json({ error: 'Not Authenticated.' })
            } else {
                res.status(500).json({ error: 'Something went wrong.' })
            }
        }

        const occasions = await response.json()
        res.status(200).json(occasions)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' })
    }

}