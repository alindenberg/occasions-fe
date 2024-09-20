import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { slug } = req.query;
    const response = await fetch(
        `${process.env.SERVER_URL}/occasions/${slug}`,
        {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`
            }
        });
    const json = await response.json();
    if (!response.ok) {
        res.status(response.status).json({ error: json.detail ?? 'Error fetching occasion' });
        return;
    }

    res.status(200).json(json);
}