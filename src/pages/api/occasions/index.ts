import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    switch (req.method) {
        case "GET":
            try {
                const response = await fetch(`${process.env.SERVER_URL}/occasions`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch occasions');
                }
                const data = await response.json();
                res.status(200).json(data);
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
            break;
        // ... handle other methods (POST, PUT, DELETE) similarly
    }
}