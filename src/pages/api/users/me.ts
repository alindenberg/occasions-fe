import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req);
    const response = await fetch(`${process.env.SERVER_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        res.status(401).json({ message: "Unauthorized" });
        throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    res.status(200).json(data);
}