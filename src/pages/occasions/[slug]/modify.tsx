import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Occasion } from '@/types/occasions';
import { getLocalizedDateInputValue } from '@/utils/utils';
import ModifyOccasionComponent from '@/components/occasions/Edit';

export default function ModifyOccasionPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [occasion, setOccasion] = useState<Occasion | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (slug) {
            const fetchOccasion = async () => {
                setIsLoading(true);
                const res = await fetch(`/api/occasions/${slug}`);
                if (res.status === 401) {
                    router.push('/occasions');
                    return;
                }
                const data = await res.json();
                setOccasion(data);
                setIsLoading(false);
            };
            fetchOccasion();
        }
    }, [slug, router]);

    function onModifyFormSubmit({ label, type, date, customInput }: any) {
        // Implement the function logic here
        const modifyOccasion = async () => {
            const response = await fetch(`/api/occasions/${slug}/modify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, type, date, customInput })
            });
            const json = await response.json();
            if (!response.ok) {
                throw { type: 'OccasionModifyError', detail: json.detail };
            }
            router.push('/');
        };
        modifyOccasion();
    }

    return (
        <div className='mt-4 sm:mt-8 md:mt-12 mx-4 flex items-center justify-center'>
            {isLoading && <p>Loading...</p>}
            {!isLoading && occasion &&
                <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                    <ModifyOccasionComponent occasion={occasion} formSubmitFunction={onModifyFormSubmit} />
                </div>
            }
        </div>
    );
}