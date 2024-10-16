import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'

interface Props {
    occasions: Occasion[]
}

export default function PastOccasionsList({ occasions }: Props) {
    return occasions.length ?
        (
            <div>
                {occasions.map((occasion, index) => (
                    <div className="py-4" key={occasion.id}>
                        <OccasionTile occasion={occasion} modifyHandler={null} deletionHandler={null} fundHandler={null} />
                    </div>
                ))}
            </div>
        )
        :
        (
            <div className="py-4">
                <div className="dark:text-black text-center py-4 bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden">
                    <p>No past occasions to display... :(</p>
                </div>
            </div>
        )
}