import { useRouter } from 'next/router';
import CreateOccasionForm from '@/components/occasions/Edit';


export default function NewOccasionPage() {
    const router = useRouter();
    const createOccasionFunction = async ({ label, type, date, customInput }: any) => {
        // Implement the function logic here
        const response = await fetch('/api/occasions/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label, type, date, customInput })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating occasion:', errorData.error);
            return;
        }

        router.push('/occasions');
    }

    return (
        <div className='flex min-h-screen flex-col flex-grow items-center border-2 border-green-500'>
            <div className="flex flex-col w-full flex-grow border-2 border-orange-500">
                <h1>New Occasion</h1>
                <div className="flex-col flex items-center justify-center flex-grow border-2 border-blue-400">
                    <div className="w-3/4 lg:w-1/3 sm:w-1/2">
                        <CreateOccasionForm formSubmitFunction={createOccasionFunction} />
                    </div>
                </div>
            </div>
        </div>
    );
}