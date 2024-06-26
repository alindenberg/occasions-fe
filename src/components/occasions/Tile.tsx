import { useState } from "react";
import { Occasion } from "@/types/occasions";

interface OccasionTileProps {
    occasion: Occasion;
    modifyHandler: null | Function;
    deletionHandler: null | Function;
}

export default function OccasionTile({ occasion, modifyHandler, deletionHandler }: OccasionTileProps) {
    const handleDelete = async () => {
        if (!deletionHandler) {
            return;
        }

        await deletionHandler(occasion.id);
    }

    const handleModify = async () => {
        if (!modifyHandler) {
            return;
        }

        await modifyHandler(occasion.id);
    }

    const [isSummaryExpanded, setisSummaryExpanded] = useState(false);

    const handleExpandClick = () => {
        setisSummaryExpanded(!isSummaryExpanded);
    };

    return (
        <div className='bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden'>
            <div className='p-6'>
                <h2 className='font-bold text-2xl mb-2'>{occasion?.label ?? 'Label'}</h2>
                <hr className='border-gray-400 mb-4' />
                <h2 className='text-gray-700'>Type: {occasion.type}</h2>
                <h2 className='text-gray-700'>Date: {new Date(occasion.date).toLocaleString()}</h2>
                <div className='text-gray-700'>
                    Notes: {occasion?.custom_input}
                </div>
                {occasion.summary &&
                    <div className='text-gray-700'>
                        <span>Summary: </span>
                        {
                            occasion.summary.length < 20 ?
                                <span>
                                    {occasion.summary}
                                </span>
                                :
                                <span>
                                    {isSummaryExpanded ? occasion.summary : occasion.summary.substring(0, 15) + "..."}
                                    <a href="#" onClick={handleExpandClick} style={{ textDecoration: 'none', color: 'blue' }}>
                                        {isSummaryExpanded ? ' show less' : ' show more'}
                                    </a>
                                </span>
                        }
                    </div>
                }
            </div>
            <div className="flex flex-row items-center justify-center p-4 border-t border-gray-200">
                {modifyHandler && <button onClick={handleModify} className="px-4 py-2 bg-blue-500 m-1 text-white rounded hover:bg-blue-700">Modify</button>}
                {deletionHandler && <button onClick={handleDelete} className="px-4 py-2 bg-red-500 m-1 text-white rounded hover:bg-red-700">Delete</button>}
            </div>
        </div>
    )
}