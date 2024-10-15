import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'
import CreateOccasionBtn from '@/components/CreateOccasionBtn'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface Props {
    occasions: Occasion[]
    deletionHandler: (occasion_id: number) => void
    modifyHandler: (occasion_id: number) => void
}

export default function UpcomingOccasionsList({ occasions, deletionHandler, modifyHandler }: Props) {
    const router = useRouter()
    const { data: session, status } = useSession()

    const renderButton = () => {
        if (session === null || session.user === undefined) {
            return <div>Loading...</div>
        }

        return (
            <>
                <CreateOccasionBtn
                    disabled={session.user.credits <= 0}
                    credits={session.user.credits}
                />
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
                <div className="dark:text-black text-center py-4 bg-gray-100 border border-orange-400 shadow-xl rounded-lg overflow-hidden">
                    <p>Well that&apos;s bizarre. You have no upcoming occasions.</p>
                    <p>Quick, add them before you forget!</p>
                    <div className="flex justify-center pt-2">{renderButton()}</div>
                </div>
            </div>
    )
}