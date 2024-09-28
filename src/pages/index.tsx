import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { OCCASION_SORTS, Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'
import { NextApiRequest, NextApiResponse } from 'next'

import { OCCASION_FILTERS } from '@/types/occasions'
import Detail from '@/components/Detail';
import OccasionsFilterDropdown from '@/components/occasions/FilterDropdown';
import OccasionsSortDropdown from '@/components/occasions/SortDropdown';
import PastOccasionsList from '@/components/occasions/PastOccasionsList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';
import { getAccessToken } from '@/utils/auth';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function OccasionsPage({ initialOccasions }: { initialOccasions: Occasion[] }) {
  const router = useRouter()
  const { session, refreshSession } = useAuthSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [occasionsList, setOccasionsList] = useState<Occasion[]>([]);
  const [viewingUpcoming, setViewingUpcoming] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session !== undefined) {
      setIsAuthenticated(!!session);
      if (!!session) {
        setOccasionsList(initialOccasions);
        filterOccasions(OCCASION_FILTERS.UPCOMING);
      }
    }
    setIsLoading(false);
  }, [session, initialOccasions]);

  async function deletionHandler(occasion_id: number) {
    const response = await fetch(`/api/occasions/${occasion_id}/delete`);
    if (!response.ok) {
      throw new Error('Failed to delete occasion');
    }
    const updatedOccasions = occasionsList.filter(occasion => occasion.id !== occasion_id);
    setOccasionsList(updatedOccasions);
    await refreshSession()
  }

  async function modifyHandler(occasion_id: number) {
    router.push(`/occasions/${occasion_id}/modify`);
  }

  function filterOccasions(filter: string) {
    if (filter === OCCASION_FILTERS.UPCOMING) {
      const filteredOccasions = occasionsList.filter(occasion => new Date(occasion.date) > new Date());
      setOccasionsList(filteredOccasions);
      setViewingUpcoming(true);
    }
    if (filter === OCCASION_FILTERS.PAST) {
      const filteredOccasions = occasionsList.filter(occasion => new Date(occasion.date) < new Date());
      setOccasionsList(filteredOccasions);
      setViewingUpcoming(false);
    }
  }

  function sortOccasions(sort: string) {
    if (sort === OCCASION_SORTS.DATE_DESCENDING) {
      const sortedOccasions = [...occasionsList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setOccasionsList(sortedOccasions);
    }
    if (sort === OCCASION_SORTS.DATE_ASCENDING) {
      const sortedOccasions = [...occasionsList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOccasionsList(sortedOccasions);
    }
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <main
      className="flex flex-grow flex-col items-center justify-center mt-4"
    >
      <div className="flex flex-col flex-grow w-full md:w-3/4 lg:w-1/2 p-2">
        {isAuthenticated ? (
          <>
            <div className='flex flex-row justify-between'>
              <OccasionsFilterDropdown onClick={filterOccasions} />
              <OccasionsSortDropdown onClick={sortOccasions} />
            </div>
            {viewingUpcoming && <UpcomingOccasionsList occasions={occasionsList} modifyHandler={modifyHandler} deletionHandler={deletionHandler} />}
            {!viewingUpcoming && <PastOccasionsList occasions={occasionsList} />}
          </>
        ) : (
          <div className="dark:text-black overflow-hidden justify-center items-center flex flex-grow">
            <div className="flex flex-col items-center">
              <Detail />
              <div className="mt-6">
                <button
                  className="w-48 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-200 ease-in-out hover:scale-105 text-lg"
                  onClick={() => router.push('/login')}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main >
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let initialOccasions: Occasion[] = []
  try {
    const accessToken = await getAccessToken(context.req as NextApiRequest, context.res as NextApiResponse)
    if (accessToken) {
      const response = await fetch(`${process.env.SERVER_URL}/occasions`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      initialOccasions = await response.json()
    }
  } catch (error) {
    console.error("Error fetching occasions:", error)
    initialOccasions = [] // Set to empty array on error
  }

  return {
    props: {
      initialOccasions,
    },
  }
}