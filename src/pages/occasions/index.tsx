import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'

import { OCCASION_FILTERS } from '@/types/occasions'
import LoginPrompt from '@/components/LoginPrompt'
import OccasionsFilterDropdown from '@/components/occasions/FilterDropdown';
import PastOccasionsList from '@/components/occasions/PastOccasionsList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';

export default function OccasionsPage({ occasions, isAuthenticated }: { occasions: Occasion[], isAuthenticated: boolean }) {
    const router = useRouter()

    const [occasionsList, setOccasionsList] = useState(occasions);
    const [viewingUpcoming, setViewingUpcoming] = useState(true);

    useEffect(() => {
        // todo: refactor api call for and separate list of occasions
        Promise.any([filterOccasions(OCCASION_FILTERS.UPCOMING)])
    })

    async function deletionHandler(occasion_id: number) {
        const response = await fetch(`/api/occasions/${occasion_id}/delete`);
        if (!response.ok) {
            throw new Error('Failed to delete occasion');
        }
        const updatedOccasions = occasionsList.filter(occasion => occasion.id !== occasion_id);
        setOccasionsList(updatedOccasions);
    }

    async function modifyHandler(occasion_id: number) {
        router.push(`/occasions/${occasion_id}/modify`);
    }

    async function filterOccasions(filter: string) {
        if (filter === OCCASION_FILTERS.UPCOMING) {
            const filteredOccasions = occasions.filter(occasion => new Date(occasion.date) > new Date());
            setOccasionsList(filteredOccasions);
            setViewingUpcoming(true);
        }
        if (filter === OCCASION_FILTERS.PAST) {
            const filteredOccasions = occasions.filter(occasion => new Date(occasion.date) < new Date());
            setOccasionsList(filteredOccasions);
            setViewingUpcoming(false);
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">
                <LoginPrompt />
            </div>
        )
    }

    return (
        <main
            className="flex flex-grow flex-col items-center mt-4"
        >
            <div className="flex flex-col flex-grow w-full md:w-3/4 lg:w-1/2 p-2">
                <OccasionsFilterDropdown onClick={filterOccasions} />
                {viewingUpcoming && <UpcomingOccasionsList occasions={occasionsList} modifyHandler={modifyHandler} deletionHandler={deletionHandler} />}
                {!viewingUpcoming && <PastOccasionsList occasions={occasionsList} />}
            </div>
            {/* </div > */}
        </main >
    )
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Fetch data from external API
    const authCookie = context.req.cookies.Authorization;
    if (!authCookie) {
        return { props: { occasions: [], isAuthenticated: false } }
    }

    const res = await fetch('http://localhost:3000/api/occasions/', {
        headers: {
            'Authorization': authCookie
        }
    });
    if (res.status === 401) {
        return { props: { occasions: [], isAuthenticated: false } }
    }
    const occasions = await res.json()

    // Pass data to the page via props
    return { props: { occasions, isAuthenticated: true } }
}