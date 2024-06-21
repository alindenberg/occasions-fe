import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;
    const response = await fetch(
        `${process.env.SERVER_URL}/occasions/${slug}`,
        {
            method: 'DELETE',
            headers: { 'Authorization': req?.headers?.authorization || 'None' }
        }
    )
    if (!response.ok) {
        res.status(response.status).json({ error: 'Failed to delete occasion' });
        return;
    }
    res.status(200).json({ message: 'Occasion deleted successfully' });
}
