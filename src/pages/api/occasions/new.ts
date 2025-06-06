import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "POST") {
        try {
            const response = await fetch(`${process.env.SERVER_URL}/occasions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    label: req.body.label,
                    type: req.body.type,
                    tone: req.body.tone,
                    date: req.body.date,
                    custom_input: req.body.customInput,
                    is_recurring: req.body.is_recurring
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create new occasion');
            }
            const data = await response.json();
            res.status(201).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
