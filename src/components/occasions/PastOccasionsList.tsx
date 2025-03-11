import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'

interface Props {
    occasions: Occasion[]
}

export default function PastOccasionsList({ occasions }: Props) {
    return (
        <div>
            {occasions.map((occasion, index) => (
                <div className="py-4" key={occasion.id}>
                    <OccasionTile occasion={occasion} modifyHandler={null} deletionHandler={null} fundHandler={null} />
                </div>
            ))}
        </div>
    )
}