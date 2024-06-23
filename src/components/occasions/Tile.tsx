import { Occasion } from "@/types/occasions";

interface OccasionTileProps {
    occasion: Occasion;
    modifyHandler: Function;
    deletionHandler: Function;
}

export default function OccasionTile({ occasion, modifyHandler, deletionHandler }: OccasionTileProps) {
    const handleDelete = async () => {
        await deletionHandler(occasion.id);
    }

    const handleModify = async () => {
        await modifyHandler(occasion.id);
    }

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
            </div>
            <div className="flex flex-row items-center justify-center p-4 border-t border-gray-200">
                <button onClick={handleModify} className="px-4 py-2 bg-blue-500 m-1 text-white rounded hover:bg-blue-700">Modify</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 m-1 text-white rounded hover:bg-red-700">Delete</button>
            </div>
        </div>
    )
}