import { Occasion } from '@/types/occasions/index'
import OccasionTile from '@/components/occasions/Tile'
import CreateOccasionBtn from '@/components/CreateOccasionBtn'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface Props {
    occasions: Occasion[]
    deletionHandler: (occasion_id: number) => void
    fundHandler: (occasion_id: number) => void
    openCreateModal?: () => void
}

export default function DraftOccasionList({ occasions, deletionHandler, fundHandler, openCreateModal }: Props) {
    const router = useRouter()
    const { data: session, status } = useSession()

    const renderButton = () => {
        if (session === null || session.user === undefined) {
            return <div>Loading...</div>
        }

        return (
            <>
                <CreateOccasionBtn
                    disabled={occasions?.length >= 5 || session.user.credits <= 0}
                    credits={session.user.credits}
                    openCreateModal={openCreateModal}
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
        <div>
            {occasions.map((occasion) => (
                <div className="pt-4" key={occasion.id}>
                    <OccasionTile
                        occasion={occasion}
                        modifyHandler={null}
                        deletionHandler={deletionHandler}
                        fundHandler={fundHandler}
                    />
                </div>
            ))}
            <div className="flex justify-center py-6">{renderButton()}</div>
        </div>
    );
}
