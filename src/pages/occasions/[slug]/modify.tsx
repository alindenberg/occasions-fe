import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Occasion } from '@/types/occasions';
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
        console.log('Occasion modified with:', { label, type, date, customInput });
    }

    return (
        <div>
            <h1>Modify Occasion</h1>
            {isLoading ? <p>Loading...</p> : occasion && <ModifyOccasionComponent occasion={occasion} formSubmitFunction={onModifyFormSubmit} />}
        </div>
    );
}