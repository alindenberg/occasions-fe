import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router'
import { OCCASION_SORTS, Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'
import { NextApiRequest } from 'next';
import Head from 'next/head';

import { OCCASION_FILTERS } from '@/types/occasions'
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/occasions/DashboardCard';
import OccasionsSortDropdown from '@/components/occasions/SortDropdown';
import PastOccasionsList from '@/components/occasions/PastOccasionsList';
import DraftOccasionsList from '@/components/occasions/DraftOccasionList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';
import { getAccessToken } from '@/utils/auth';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function OccasionsPage({ initialOccasions }: { initialOccasions: Occasion[] }) {
  const router = useRouter()
  const { session, status, refreshSession } = useAuthSession()
  const isAuthenticated = !!session

  const [occasions, setOccasions] = useState<Occasion[]>(initialOccasions);
  const [occasionsList, setOccasionsList] = useState<Occasion[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<OCCASION_SORTS>(OCCASION_SORTS.DATE_DESCENDING);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  const hasDraftOccasions = occasions.some(occasion => occasion.is_draft);

  const filterAndSortOccasions = useCallback(() => {
    const filteredOccasions = filterOccasions(currentFilter, occasions);
    const sortedOccasions = sortOccasions(currentSort, filteredOccasions);
    setOccasionsList(sortedOccasions);
  }, [occasions, currentFilter, currentSort]);

  useEffect(() => {
    if (router.isReady) {
      const sort = (router.query.sort as string) || OCCASION_SORTS.DATE_DESCENDING;
      setCurrentSort(sort as OCCASION_SORTS);
      filterAndSortOccasions();
    }
  }, [router.isReady, router.query, occasions, filterAndSortOccasions]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  async function deletionHandler(occasion_id: number) {
    const response = await fetch(`/api/occasions/${occasion_id}/delete`);
    if (response.ok) {
      const data = await response.json();
      refreshSession();
      setOccasions(occasions.filter(occasion => occasion.id !== occasion_id));
    }
  }

  async function modifyHandler(occasion_id: number) {
    router.push(`/occasions/${occasion_id}/edit`);
  }

  async function fundHandler(occasion_id: number) {
    const response = await fetch(`/api/occasions/${occasion_id}/fund`);
    if (response.ok) {
      const data = await response.json();
      refreshSession();
      setOccasions(occasions.map(occasion => {
        if (occasion.id === occasion_id) {
          return { ...occasion, is_draft: false };
        }
        return occasion;
      }));
    }
  }

  function filterOccasions(filter: string, occasionsToFilter: Occasion[]): Occasion[] {
    return occasionsToFilter;
  }

  function sortOccasions(sort: OCCASION_SORTS, occasionsToSort: Occasion[]): Occasion[] {
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

  // Count upcoming occasions in the next 7 days
  const upcomingThisWeek = occasions.filter(occasion => {
    const occasionDate = new Date(occasion.date);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return occasionDate >= today && occasionDate <= nextWeek && !occasion.is_draft;
  }).length;

  // Count upcoming occasions in the next 30 days
  const upcomingThisMonth = occasions.filter(occasion => {
    const occasionDate = new Date(occasion.date);
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    return occasionDate >= today && occasionDate <= nextMonth && !occasion.is_draft;
  }).length;

  // Get most common occasion type
  const getCommonOccasionType = () => {
    const typeCounts = occasions.reduce((acc, occasion) => {
      if (!occasion.is_draft) {
        acc[occasion.type] = (acc[occasion.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    let maxType = '';
    let maxCount = 0;

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxType = type;
        maxCount = count;
      }
    });

    return { type: maxType, count: maxCount };
  };

  const commonType = getCommonOccasionType();

  return (
    <>
      <Head>
        <title>OccasionAlert | Your Occasions Dashboard</title>
        <meta name="description" content="Manage all your important occasions in one place" />
      </Head>

      <Navbar />

      <div className="flex w-full overflow-x-hidden">
        <Sidebar activeFilter={currentFilter} onFilterChange={setCurrentFilter} />

        <main className="flex-1 ml-64 pt-20 bg-gray-50 min-h-screen overflow-x-hidden">
          <div className="w-full px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Occasion Harmony</h1>
                <p className="text-gray-600">Manage all your important occasions in one place</p>
              </div>

              <div className="flex items-center">
                <div className="relative mr-4">
                  <input
                    type="text"
                    placeholder="Search occasions..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <button
                  onClick={() => router.push('/create')}
                  className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New</span>
                </button>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex space-x-2 mr-auto">
                <button
                  onClick={() => setActiveView('list')}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'list' ? 'bg-white shadow-sm text-gray-800' : 'bg-transparent text-gray-600'}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setActiveView('calendar')}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'calendar' ? 'bg-white shadow-sm text-gray-800' : 'bg-transparent text-gray-600'}`}
                >
                  Calendar View
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <OccasionsSortDropdown onClick={handleSortChange} currentSort={currentSort} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
              <DashboardCard
                title="This Week"
                subtitle={`Upcoming occasions in 7 days`}
                value={upcomingThisWeek}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                onClick={() => setCurrentFilter('this-week')}
              />

              <DashboardCard
                title="This Month"
                subtitle={`Upcoming occasions in 30 days`}
                value={upcomingThisMonth}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                accentColor="bg-blue-500"
                onClick={() => setCurrentFilter('this-month')}
              />

              <DashboardCard
                title="Most Common"
                subtitle={`Most frequent occasion type`}
                value={commonType.type ? commonType.type.charAt(0).toUpperCase() + commonType.type.slice(1) : 'None'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                }
                accentColor="bg-pink-500"
                onClick={() => setCurrentFilter(`type-${commonType.type}`)}
              />
            </div>

            {activeView === 'list' ? (
              <div className="space-y-8">
                <UpcomingOccasionsList
                  occasions={occasionsList.filter(o => new Date(o.date) >= new Date() && !o.is_draft)}
                  deletionHandler={deletionHandler}
                  modifyHandler={modifyHandler}
                />

                {hasDraftOccasions && (
                  <DraftOccasionsList
                    occasions={occasionsList.filter(o => o.is_draft)}
                    deletionHandler={deletionHandler}
                    fundHandler={fundHandler}
                  />
                )}

                <PastOccasionsList
                  occasions={occasionsList.filter(o => new Date(o.date) < new Date() && !o.is_draft)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-center text-gray-500">Calendar view coming soon!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

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
      initialOccasions: occasions,
    },
  }
}
