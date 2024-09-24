import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { OCCASION_SORTS, Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'
import { useSession } from "next-auth/react"
import { NextApiRequest, NextApiResponse } from 'next'

import { OCCASION_FILTERS } from '@/types/occasions'
import OccasionsFilterDropdown from '@/components/occasions/FilterDropdown';
import OccasionsSortDropdown from '@/components/occasions/SortDropdown';
import PastOccasionsList from '@/components/occasions/PastOccasionsList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';
import { getAccessToken } from '@/utils/auth';

export default function OccasionsPage({ occasions }: { occasions: Occasion[] }) {
  const router = useRouter()
  const { data: session } = useSession()
  const isAuthenticated = !!session

  const [occasionsList, setOccasionsList] = useState(occasions);
  const [viewingUpcoming, setViewingUpcoming] = useState(true);

  useEffect(() => {
    // todo: refactor api call for and separate list of occasions
    Promise.any([filterOccasions(OCCASION_FILTERS.UPCOMING)])
  }, [])

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

  async function sortOccasions(sort: string) {
    if (sort === OCCASION_SORTS.DATE_DESCENDING) {
      const sortedOccasions = [...occasionsList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setOccasionsList(sortedOccasions);
    }
    if (sort === OCCASION_SORTS.DATE_ASCENDING) {
      const sortedOccasions = [...occasionsList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOccasionsList(sortedOccasions);
    }
  }

  return (
    <main
      className="flex flex-grow flex-col items-center justify-center mt-4"
    >
      <div className="flex flex-col flex-grow w-full md:w-3/4 lg:w-1/2 p-2">
        {isAuthenticated ?
          (
            <>
              <div className='flex flex-row justify-between'>
                <OccasionsFilterDropdown onClick={filterOccasions} />
                <OccasionsSortDropdown onClick={sortOccasions} />
              </div>
              {viewingUpcoming && <UpcomingOccasionsList occasions={occasionsList} modifyHandler={modifyHandler} deletionHandler={deletionHandler} />}
              {!viewingUpcoming && <PastOccasionsList occasions={occasionsList} />}
            </>
          ) : (
            <div className="dark:text-black overflow-hidden justify-center items-center flex flex-grow ">
              <div className="p-8 flex flex-col items-center bg-gray-100 border border-orange-400">
                <h2 className="text-2xl font-bold">Welcome to Occasions!</h2>
                <p className="text-lg">Please log in to view your occasions.</p>
                <button
                  className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => router.push('/login')}
                >
                  Log In
                </button>
              </div>
            </div>
          )}
      </div>
    </main >
  )
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch occasions if user is authenticated
  let occasions: Occasion[] = []
  try {
    const accessToken = await getAccessToken(context.req as NextApiRequest, context.res as NextApiResponse)
    const response = await fetch(`${process.env.SERVER_URL}/occasions`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    occasions = await response.json()
  } catch (error) {
    console.error("Error fetching occasions:", error)
    occasions = [] // Set to empty array on error
  }

  return {
    props: {
      occasions,
    },
  }
}