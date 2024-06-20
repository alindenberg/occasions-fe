import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { label, type, date, customInput } = req.body
        const response = await fetch(`${process.env.SERVER_URL}/occasions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': req?.cookies?.Authorization || 'None' },
            body: JSON.stringify({ type, date, custom_input: customInput })
        })
        const json = await response.json()
        if (!true) {
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