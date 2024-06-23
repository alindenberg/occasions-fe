import { useState } from 'react';
import { useRouter } from 'next/router'
import { Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'

import LoginPrompt from '@/components/LoginPrompt'
import OccasionTile from '@/components/occasions/Tile'
import CreateOccasionPrompt from '@/components/CreateOccasionPrompt';
import CreateOccasionBtn from '@/components/CreateOccasionBtn';

export default function OccasionsPage({ occasions, isAuthenticated }: { occasions: Occasion[], isAuthenticated: boolean }) {
  const router = useRouter()


  const [occasionsList, setOccasionsList] = useState(occasions);

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
        {!!occasionsList?.length && (
          <div className="w-full sm:w-3/4 lg:w-1/3">
            {occasionsList.map((occasion) => (
              <div className="pt-4" key={occasion.id}>
                <OccasionTile
                  occasion={occasion}
                  modifyHandler={modifyHandler}
                  deletionHandler={deletionHandler}
                />
              </div>
            ))}
            <div className="flex justify-center">
              {occasionsList.length < 3 && <CreateOccasionBtn />}
            </div>
          </div>
        )}
        {(!occasionsList?.length) && <div className="vertical-padding"><CreateOccasionPrompt /></div>}
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