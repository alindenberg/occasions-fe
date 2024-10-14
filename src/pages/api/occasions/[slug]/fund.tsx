import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.query;

    try {
        const response = await fetch(`${process.env.SERVER_URL}/occasions/${slug}/activate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to activate occasion');
        }
        res.status(204).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
