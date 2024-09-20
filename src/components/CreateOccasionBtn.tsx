import { useRouter } from 'next/router';

interface CreateOccasionBtnProps {
    disabled: boolean;
    credits: number | null;
}

export default function CreateOccasionBtn({ disabled, credits }: CreateOccasionBtnProps) {
    const router = useRouter();

    const getTitle = () => {
        if (credits === null) return 'Loading...';
        if (credits <= 0) return 'You need to purchase more credits';
        if (disabled) return 'You may only have 3 upcoming occasions';
        return undefined;
    }

    return (
        <button
            onClick={() => router.push('/occasions/new')}
            disabled={disabled}
            className={`mt-4 px-4 py-2 rounded ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-700'} text-white`}
            title={getTitle()}
        >
            Create Occasion
        </button>
    )
}
