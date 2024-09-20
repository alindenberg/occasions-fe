import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

interface ExtendedSession {
    accessToken?: string;
    // Add other custom session properties here
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions) as ExtendedSession | null;
    if (!session || !session.accessToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const authHeaders = { 'Authorization': `Bearer ${session.accessToken}` };
    const response = await fetch(`${process.env.SERVER_URL}/users/me`, { headers: authHeaders });
    const json = await response.json();
    if (!response.ok) {
        res.status(401).json({ error: json.detail });
        return;
    }

    res.status(200).json(json);
}