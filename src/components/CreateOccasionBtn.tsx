import { useRouter } from 'next/router';

export default function CreateOccasionBtn({ disabled = false }: { disabled?: boolean }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/occasions/new')}
            disabled={disabled}
            className={`mt-4 px-4 py-2 rounded ${disabled ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
        >
            Create Occasion
        </button>
    )
}
