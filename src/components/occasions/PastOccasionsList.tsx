import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'

interface Props {
    occasions: Occasion[]
    deletionHandler: (occasion_id: number) => void
    modifyHandler: (occasion_id: number) => void
}

export default function PastOccasionsList({ occasions, deletionHandler, modifyHandler }: Props) {
    return (
        <div className="p-24">
            {occasions.map((occasion, index) => (
                <div className="pt-4" key={occasion.id}>
                    <OccasionTile
                        occasion={occasion}
                        modifyHandler={modifyHandler}
                        deletionHandler={deletionHandler}
                    />
                </div>
            ))}

        </div>
    )
}