import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface Props {
    occasions: Occasion[]
    deletionHandler: (occasion_id: number) => void
    modifyHandler: (occasion_id: number) => void
    openCreateModal?: () => void
}

export default function UpcomingOccasionsList({ occasions, deletionHandler, modifyHandler, openCreateModal }: Props) {
    const router = useRouter()
    const { data: session, status } = useSession()

    return (
        occasions?.length ?
            <div>
                {occasions.map((occasion) => (
                    <div className="pt-4" key={occasion.id}>
                        <OccasionTile
                            occasion={occasion}
                            modifyHandler={modifyHandler}
                            deletionHandler={deletionHandler}
                            fundHandler={null}
                        />
                    </div>
                ))}
            </div>
            :
            <div className="py-4">
                <div className="dark:text-black text-center py-4 bg-gray-100 rounded-lg overflow-hidden">
                    <p>No upcoming occasions found.</p>
                </div>
            </div>
    )
}