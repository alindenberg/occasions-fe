import { useRouter } from 'next/router';

export default function CreateOccasionBtn() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/occasions/new')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
            Create Occasion
        </button>
    )
}