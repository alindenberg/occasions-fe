import { useRouter } from 'next/router';
import CreateOccasionForm from '@/components/occasions/Edit';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function NewOccasionPage() {
    const router = useRouter();
    const { refreshSession } = useAuthSession();

    const createOccasionFunction = async ({ label, type, tone, date, customInput }: any) => {
        const response = await fetch('/api/occasions/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label, type, tone, date, customInput })
        });

        if (!response.ok) {
            const json = await response.json()
            throw { type: 'OccasionCreateError', detail: json.error }
        }

        await refreshSession();
        router.push('/');
    }

    return (
        <div className='mt-4 md:mt-8 lg:mt-12 flex flex-col flex-grow items-center'>
            <div className="flex flex-col w-full flex-grow">
                <div className="flex-col flex items-center justify-center flex-grow">
                    <div className="w-3/4 lg:w-1/3 sm:w-1/2">
                        <CreateOccasionForm formSubmitFunction={createOccasionFunction} />
                    </div>
                </div>
            </div>
        </div>
    );
}