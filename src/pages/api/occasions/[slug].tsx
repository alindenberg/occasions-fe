import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;
    const response = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, { headers: { 'Authorization': req?.headers?.authorization || 'None' } });
    const json = await response.json();
    if (!response.ok) {
        res.status(401).json({ error: json.detail });
        return
    }

    res.status(200).json(json);
}