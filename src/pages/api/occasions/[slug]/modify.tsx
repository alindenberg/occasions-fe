import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;
    const { label, type, date, customInput } = req.body;
    const authHeader = req?.headers?.authorization || req?.cookies?.Authorization || 'None';
    const response = await fetch(
        `${process.env.SERVER_URL}/occasions/${slug}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label, type, date, custom_input: customInput })
        });
    const json = await response.json();
    if (!response.ok) {
        res.status(response.status).json({ error: json.detail ?? 'Error updating occasion' });
        return
    }
    res.status(200).json(json);
}