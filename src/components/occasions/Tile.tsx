import { Occasion } from "@/types/occasions";

export default function OccasionTile({ occasion, deletionHandler }: { occasion: Occasion, deletionHandler: Function }) {
    const handleDelete = async () => {
        await deletionHandler(occasion.id);
    }

    return (
        <div className='border-2 border-red-500 sm:m-2 m-1'>
            <h2>{occasion?.label ?? 'Label'}</h2>
            <h2>Type: {occasion.type}</h2>
            <h2>Date: {new Date(occasion.date).toLocaleString()}</h2>
            <label>Input: </label>
            <div>
                {occasion?.custom_input}
            </div>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col sm:flex-row w-1/5 sm:w-full justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <a href={`/occasions/${occasion.id}/modify`} className="px-4 py-2 bg-blue-500 text-white rounded">Modify</a>
                    {/* <button onClick={handleDelete} className="mt-1 px-4 py-2 bg-blue-500 text-white rounded">Modify</button> */}
                    <button onClick={handleDelete} className="mt-1 px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                </div>
            </div>
        </div >
    )
}