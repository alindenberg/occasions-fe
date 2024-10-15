import { useState, useRef, useEffect } from "react";
import { Occasion } from "@/types/occasions";
import { useSession } from "next-auth/react";

interface OccasionTileProps {
    occasion: Occasion;
    modifyHandler: null | Function;
    deletionHandler: null | Function;
    fundHandler: null | Function;
}

export default function OccasionTile({ occasion, modifyHandler, deletionHandler, fundHandler }: OccasionTileProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFundModal, setShowFundModal] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const { data: session } = useSession();
    const deleteModalRef = useRef<HTMLDivElement>(null);
    const fundModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
                setShowDeleteModal(false);
            }
            if (fundModalRef.current && !fundModalRef.current.contains(event.target as Node)) {
                setShowFundModal(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const handleFund = async () => {
        if (!fundHandler) {
            return;
        }

        await fundHandler(occasion.id);
        setShowFundModal(false);
    }

    const handleExpandClick = () => {
        setIsSummaryExpanded(!isSummaryExpanded);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <div className='bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden'>
            <div className='p-6'>
                <h2 className='dark:text-black font-bold text-2xl mb-2'>{occasion?.label ?? 'Label'}</h2>
                <hr className='border-gray-400 mb-4' />
                <h2 className='text-gray-700'>Type: <strong>{occasion.type.charAt(0).toUpperCase() + occasion.type.slice(1)}</strong></h2>
                <h2 className='text-gray-700'>Tone: <strong>{occasion.tone.charAt(0).toUpperCase() + occasion.tone.slice(1)}</strong></h2>
                <h2 className='text-gray-700'>Date: <strong>{formatDate(occasion.date)}</strong></h2>
                <h2 className='text-gray-700'>Recurring: {occasion.is_recurring ? '✅' : '❌'}</h2>
                <div className='text-gray-700'>Occasion Notes: {occasion.custom_input}</div>
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
                {occasion.is_draft && fundHandler && (
                    <button
                        onClick={() => session?.user.credits && session?.user.credits > 0 ? setShowFundModal(true) : null}
                        className={`px-4 py-2 m-1 text-white rounded ${session?.user.credits && session?.user.credits > 0 ? 'bg-orange-500 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        title={session?.user.credits && session?.user.credits > 0 ? '' : 'You must have credits to fund a draft occasion'}
                    >
                        Fund
                    </button>
                )}
            </div>
            {showDeleteModal && (
                <div className="dark:text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div ref={deleteModalRef} className="bg-white p-6 rounded-lg mx-4">
                        <h2 className="mb-4 text-center text-xl font-bold">Delete {occasion.label}</h2>
                        <p className="mb-4 text-center px-2">Deleting this occasion will restore the 1 credit that was used to create it.</p>
                        <div className="flex justify-center">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded mr-2">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            {showFundModal && (
                <div className="dark:text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div ref={fundModalRef} className="bg-white p-6 rounded-lg mx-4">
                        <h2 className="mb-4 text-center text-xl font-bold">Fund {occasion.label}</h2>
                        <p className="mb-4 text-center px-2">This will subtract 1 credit from your account and set it to active.</p>
                        <div className="flex justify-center">
                            <button onClick={() => setShowFundModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded mr-2">Cancel</button>
                            <button onClick={handleFund} className="px-4 py-2 bg-orange-500 text-white rounded">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
