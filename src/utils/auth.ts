import { getToken } from "next-auth/jwt";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export async function getAccessToken(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    return token?.accessToken as string
}