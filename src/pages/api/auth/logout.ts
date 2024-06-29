import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Set-Cookie', `Authorization=; path = /; expires = ${new Date(0).toUTCString()};`);
    res.status(200).json({ message: 'Logout successful' });
}