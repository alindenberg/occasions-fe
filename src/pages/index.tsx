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
import DraftOccasionsList from '@/components/occasions/DraftOccasionList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';
import { getAccessToken } from '@/utils/auth';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function OccasionsPage({ occasions }: { occasions: Occasion[] }) {
  const router = useRouter()
  const { session, status, refreshSession } = useAuthSession()
  const isAuthenticated = !!session

  const [occasionsList, setOccasionsList] = useState<Occasion[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<string>(OCCASION_SORTS.DATE_DESCENDING);

  useEffect(() => {
    if (router.isReady) {
      const filter = (router.query.filter as string) || OCCASION_FILTERS.UPCOMING;
      const sort = (router.query.sort as string) || OCCASION_SORTS.DATE_DESCENDING;
      setCurrentFilter(filter);
      setCurrentSort(sort);
      const filteredOccasions = filterOccasions(filter, occasions);
      const sortedOccasions = sortOccasions(sort, filteredOccasions);
      setOccasionsList(sortedOccasions);
    }
  }, [occasions, router, router.isReady]);

  if (status === 'loading') {
    return <div>Loading...</div>
  }

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

  async function fundHandler(occasion_id: number) {
    const response = await fetch(`/api/occasions/${occasion_id}/fund`);
    if (!response.ok) {
      throw new Error('Failed to fund occasion');
    }
    const updatedOccasions = occasionsList.filter(occasion => occasion.id !== occasion_id);
    setOccasionsList(updatedOccasions);
    await refreshSession()
  }

  function filterOccasions(filter: string, occasionsToFilter: Occasion[]): Occasion[] {
    if (filter === OCCASION_FILTERS.UPCOMING) {
      return occasionsToFilter.filter(occasion => !occasion.is_draft && new Date(occasion.date) > new Date());
    } else if (filter === OCCASION_FILTERS.PAST) {
      return occasionsToFilter.filter(occasion => !occasion.is_draft && new Date(occasion.date) < new Date());
    } else if (filter === OCCASION_FILTERS.DRAFT) {
      return occasionsToFilter.filter(occasion => occasion.is_draft);
    }
    return occasionsToFilter;
  }

  function handleFilterChange(filter: string) {
    setCurrentFilter(filter);
    const filteredOccasions = filterOccasions(filter, occasions);
    const sortedOccasions = sortOccasions(currentSort, filteredOccasions);
    setOccasionsList(sortedOccasions);

    // Update URL without redirecting
    router.push({
      pathname: router.pathname,
      query: { ...router.query, filter: filter },
    }, undefined, { shallow: true });
  }

  function sortOccasions(sort: string, occasionsToSort: Occasion[]): Occasion[] {
    if (sort === OCCASION_SORTS.DATE_ASCENDING) {
      return [...occasionsToSort].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (sort === OCCASION_SORTS.DATE_DESCENDING) {
      return [...occasionsToSort].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return occasionsToSort;
  }

  function handleSortChange(sort: OCCASION_SORTS) {
    setCurrentSort(sort);
    const sortedOccasions = sortOccasions(sort, occasionsList);
    setOccasionsList(sortedOccasions);

    // Update URL without redirecting
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sort: sort },
    }, undefined, { shallow: true });
  }

  return (
    <main
      className="flex flex-grow flex-col items-center justify-center"
    >
      <div className="flex flex-col flex-grow w-full md:w-3/4 lg:w-1/2 p-2">
        {isAuthenticated ?
          (
            <>
              <div className='flex flex-row justify-between'>
                <OccasionsFilterDropdown onClick={handleFilterChange} currentFilter={currentFilter} />
                <OccasionsSortDropdown onClick={handleSortChange} currentSort={currentSort as OCCASION_SORTS} />
              </div>
              {currentFilter === OCCASION_FILTERS.UPCOMING
                && <UpcomingOccasionsList occasions={occasionsList} modifyHandler={modifyHandler} deletionHandler={deletionHandler} />}
              {currentFilter === OCCASION_FILTERS.PAST
                && <PastOccasionsList occasions={occasionsList} />}
              {currentFilter === OCCASION_FILTERS.DRAFT
                && <DraftOccasionsList occasions={occasionsList} deletionHandler={deletionHandler} fundHandler={fundHandler} />}
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

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch occasions if user is authenticated
  let occasions: Occasion[] = []
  try {
    const accessToken = await getAccessToken(context.req as NextApiRequest)
    if (accessToken) {
      const response = await fetch(`${process.env.SERVER_URL}/occasions`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      occasions = await response.json()
    }
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
