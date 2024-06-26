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
                    <div className="pt-4" key={occasion.id}>
                        <OccasionTile occasion={occasion} modifyHandler={null} deletionHandler={null} />
                    </div>
                ))}

            </div>
        )
        :
        (
            <div className="text-center p-4 bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden">
                <p>No past occasions to display... :(</p>
                {/* <div className="flex justify-center pt-2"><CreateOccasionBtn /></div> */}
            </div>
        )
}