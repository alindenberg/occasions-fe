import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'
import CreateOccasionBtn from '@/components/CreateOccasionBtn'
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

    const renderButton = () => {
        if (session === null || session.user === undefined) {
            return <div>Loading...</div>
        }

        return (
            <>
                <button
                    onClick={openCreateModal}
                    disabled={session.user.credits <= 0}
                    className={`mt-4 px-4 py-2 rounded ${session.user.credits <= 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-700'} text-white`}
                    title={session.user.credits <= 0 ? 'You need to purchase more credits' : undefined}
                >
                    Create Occasion
                </button>
                {session.user.credits <= 0 && (
                    <button
                        onClick={() => router.push('/credits')}
                        className="mt-4 ml-2 px-4 py-2 rounded bg-orange-500 hover:bg-orange-700 text-white"
                    >
                        Purchase More Credits
                    </button>
                )}
            </>
        )
    }

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
                <div className="flex justify-center py-6">{renderButton()}</div>
            </div>
            :
            <div className="py-4">
                <div className="dark:text-black text-center py-4 bg-gray-100 rounded-lg overflow-hidden">
                    <p>No upcoming occasions found.</p>
                </div>
            </div>
    )
}