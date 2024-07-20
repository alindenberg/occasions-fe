import { useRouter } from 'next/router';

export default function CreateOccasionBtn({ disabled = false }: { disabled?: boolean }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/occasions/new')}
            disabled={disabled}
            className={`mt-4 px-4 py-2 rounded ${disabled ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-700'} text-white`}
            title={disabled ? 'You may only have 3 upcoming occasions' : undefined}
        >
            Create Occasion
        </button>
    )
}
