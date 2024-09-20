import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export async function getAccessToken(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
    const session = await getServerSession(req, res, authOptions);
    return session?.accessToken || null;
}