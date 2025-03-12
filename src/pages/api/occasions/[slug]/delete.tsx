import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.query;

    try {
        // First, get the occasion to check if it's a draft or has a future date
        const getResponse = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!getResponse.ok) {
            throw new Error('Failed to fetch occasion');
        }

        const occasion = await getResponse.json();

        // Check if the occasion is a draft or has a future date
        if (!occasion.is_draft && new Date(occasion.date) <= new Date()) {
            return res.status(403).json({ error: "Cannot delete processed occasions" });
        }

        // If it's a draft or has a future date, proceed with deletion
        const deleteResponse = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete occasion');
        }

        res.status(204).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
