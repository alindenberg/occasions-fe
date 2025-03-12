import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { slug } = req.query;

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
            return res.status(403).json({ error: "Cannot modify processed occasions" });
        }

        // If it's a draft or has a future date, proceed with modification
        const { label, type, tone, date, customInput, is_recurring } = req.body;
        const modifyResponse = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label, type, tone, date, custom_input: customInput, is_recurring })
        });

        if (!modifyResponse.ok) {
            throw new Error('Failed to modify occasion');
        }

        const data = await modifyResponse.json();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
