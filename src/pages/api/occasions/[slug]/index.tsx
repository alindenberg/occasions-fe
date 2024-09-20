import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req, res);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.query;

    if (req.method === "GET") {
        try {
            const response = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch occasion');
            }
            const data = await response.json();
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}