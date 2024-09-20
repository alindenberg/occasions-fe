import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const { label, type, tone, date, customInput } = req.body
        const response = await fetch(`${process.env.SERVER_URL}/occasions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ label, type, tone, date, custom_input: customInput })
        })
        const json = await response.json()
        if (!response.ok) {
            throw { type: 'OccasionCreateError', detail: json.detail }
        }

        res.status(200).json({ "message": "Occasion created successfully" })
    } catch (error: any) {
        if (error.type === 'OccasionCreateError') {
            res.status(401).json({ error: error.detail })
        } else {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }
}