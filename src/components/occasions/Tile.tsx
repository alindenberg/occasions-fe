import { Occasion } from "@/types/occasions";

export default function OccasionTile({ occasion, deletionHandler }: { occasion: Occasion, deletionHandler: Function }) {
    const handleDelete = async () => {
        await deletionHandler(occasion.id);
    }

    return (
        <div className='border-2 border-red-500'>
            <h2>{occasion.type}</h2>
            <p>{occasion.date}</p>
            <a href={`/occasions/${occasion.id}/modify`}>Modify</a>
            <button onClick={handleDelete}>Delete</button>
        </div >
    )
}