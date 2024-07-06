import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'
import CreateOccasionBtn from '@/components/CreateOccasionBtn'

interface Props {
    occasions: Occasion[]
    deletionHandler: (occasion_id: number) => void
    modifyHandler: (occasion_id: number) => void
}

export default function UpcomingOccasionsList({ occasions, deletionHandler, modifyHandler }: Props) {
    return (
        occasions?.length ?
            <div>
                {occasions.map((occasion, index) => (
                    <div className="pt-4" key={occasion.id}>
                        <OccasionTile
                            occasion={occasion}
                            modifyHandler={modifyHandler}
                            deletionHandler={deletionHandler}
                        />
                    </div>
                ))}
                <div className="flex justify-center py-6"><CreateOccasionBtn disabled={occasions?.length >= 3} /></div>
            </div>
            :
            <div className="py-4">
                <div className="text-center py-4 bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden">
                    <p>Well that&apos;s bizarre. You have no upcoming occasions.</p>
                    <p>Quick, add them before you forget!</p>
                    <div className="flex justify-center pt-2"><CreateOccasionBtn /></div>
                </div>
            </div>
    )
}