import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { slug } = req.query;
    const { label, type, tone, date, customInput } = req.body;
    const response = await fetch(
        `${process.env.SERVER_URL}/occasions/${slug}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label, type, tone, date, custom_input: customInput })
        });
    const json = await response.json();
    if (!response.ok) {
        res.status(response.status).json({ error: json.detail ?? 'Error updating occasion' });
        return;
    }
    res.status(200).json(json);
}