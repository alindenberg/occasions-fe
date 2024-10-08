import { useState } from "react";
import { Occasion } from "@/types/occasions";

interface OccasionTileProps {
    occasion: Occasion;
    modifyHandler: null | Function;
    deletionHandler: null | Function;
}

export default function OccasionTile({ occasion, modifyHandler, deletionHandler }: OccasionTileProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    const handleDelete = async () => {
        if (!deletionHandler) {
            return;
        }

        await deletionHandler(occasion.id);
        setShowDeleteModal(false);
    }

    const handleModify = async () => {
        if (!modifyHandler) {
            return;
        }

        await modifyHandler(occasion.id);
    }

    const handleExpandClick = () => {
        setIsSummaryExpanded(!isSummaryExpanded);
    };

    return (
        <div className='bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden'>
            <div className='p-6'>
                <h2 className='dark:text-black font-bold text-2xl mb-2'>{occasion?.label ?? 'Label'}</h2>
                <hr className='border-gray-400 mb-4' />
                <h2 className='text-gray-700'>Type: {occasion.type.charAt(0).toUpperCase() + occasion.type.slice(1)}</h2>
                <h2 className='text-gray-700'>Tone: {occasion.tone.charAt(0).toUpperCase() + occasion.tone.slice(1)}</h2>
                <h2 className='text-gray-700'>Date: {new Date(occasion.date).toLocaleString()}</h2>
                <br></br>
                <div className='text-gray-700'>
                    Notes: {occasion?.custom_input}
                </div>
                {occasion.summary &&
                    <div className='text-gray-700'>
                        <br></br>
                        <span>Summary: </span>
                        {
                            occasion.summary.length < 40 ?
                                <span className="italic">
                                    {occasion.summary}
                                </span>
                                :
                                <span className="italic">
                                    {isSummaryExpanded ? occasion.summary : occasion.summary.substring(0, 35) + "..."}
                                    <a href="#" onClick={handleExpandClick} style={{ textDecoration: 'none', color: 'blue' }}>
                                        {isSummaryExpanded ? ' show less' : ' show more'}
                                    </a>
                                </span>
                        }
                    </div>
                }
            </div>
            <div className="flex flex-row items-center justify-center p-4 border-t border-gray-200">
                {modifyHandler && <button onClick={handleModify} className="px-4 py-2 bg-orange-500 hover:bg-orange-700 m-1 text-white rounded">Modify</button>}
                {deletionHandler && <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-gray-400 m-1 text-white rounded hover:bg-red-700">Delete</button>}
            </div>
            {showDeleteModal && (
                <div className="dark:text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg mx-4">
                        <h2 className="mb-4 text-center text-xl font-bold">Delete {occasion.label}</h2>
                        <p className="mb-4 text-center px-2">Deleting this occasion will restore the 1 credit that was used to create it.</p>
                        <div className="flex justify-center">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded mr-2">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}