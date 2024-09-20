import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await getAccessToken(req, res);

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.query;

    if (req.method === "DELETE") {
        try {
            const response = await fetch(`${process.env.SERVER_URL}/occasions/${slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete occasion');
            }
            res.status(204).end();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
