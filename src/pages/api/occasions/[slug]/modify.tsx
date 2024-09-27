import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req, res);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }


    try {
        const { slug } = req.query;
        const { label, type, tone, date, customInput } = req.body;
        const response = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label, type, tone, date, custom_input: customInput })
        });
        if (!response.ok) {
            throw new Error('Failed to modify occasion');
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}