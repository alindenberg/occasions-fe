import { useState } from 'react';
import { useRouter } from 'next/router'
import { Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'

import { OCCASION_FILTERS } from '@/types/occasions'
import LoginPrompt from '@/components/LoginPrompt'
import OccasionTile from '@/components/occasions/Tile'
import CreateOccasionPrompt from '@/components/CreateOccasionPrompt';
import CreateOccasionBtn from '@/components/CreateOccasionBtn';
import OccasionsFilterDropdown from '@/components/occasions/FilterDropdown';

export default function OccasionsPage({ occasions, isAuthenticated }: { occasions: Occasion[], isAuthenticated: boolean }) {
  const router = useRouter()

  const [occasionsList, setOccasionsList] = useState(occasions);
  const [viewingUpcoming, setViewingUpcoming] = useState(true);

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
      <div className="vertical-padding">
        <LoginPrompt />
      </div>
    )
  }

  return (
    <main
      className="flex flex-col items-center mt-4"
    >
      <div className="flex flex-grow w-full flex-col items-center justify-start">
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
          <OccasionsFilterDropdown onClick={filterOccasions} />
          {!!occasionsList?.length && (
            <div className="w-full">
              {occasionsList.map((occasion, index) => (
                <div className="pt-4" key={occasion.id}>
                  <OccasionTile
                    occasion={occasion}
                    modifyHandler={modifyHandler}
                    deletionHandler={deletionHandler}
                  />
                </div>
              ))}
              <div className="flex justify-center pt-2">
                {occasionsList.length < 3 && <CreateOccasionBtn />}
              </div>
            </div>
          )}
        </div>
        {(!occasionsList?.length && viewingUpcoming) && <div className="vertical-padding"><CreateOccasionPrompt /></div>}
        {(!occasionsList?.length && !viewingUpcoming) && <div className="vertical-padding p-24 border-2 border-orange-400 bg-gray-100">
          No past occasions to display!
          <div>
            <button onClick={() => filterOccasions(OCCASION_FILTERS.UPCOMING)} className="px-4 py-2 mt-2 bg-orange-500 m-1 text-white rounded hover:bg-orange-500">View upcoming occasions</button>
          </div>
        </div>}
      </div>
    </main>
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