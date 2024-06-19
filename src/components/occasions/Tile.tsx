import { Occasion } from "@/types/occasions";

export default function OccasionTile({ occasion }: { occasion: Occasion }) {
    return (
        <div className='border-2 border-red-500'>
            <h2>{occasion.type}</h2>
            <p>{occasion.date}</p>
            <a href={`/occasions/${occasion.id}/modify`}>Modify</a>
        </div >
    )
}