import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router'
import { OCCASION_SORTS, Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'
import { NextApiRequest } from 'next';
import Head from 'next/head';

import { OCCASION_FILTERS } from '@/types/occasions'
import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/occasions/DashboardCard';
import OccasionsSortDropdown from '@/components/occasions/SortDropdown';
import PastOccasionsList from '@/components/occasions/PastOccasionsList';
import DraftOccasionsList from '@/components/occasions/DraftOccasionList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';
import CreateModal from '@/components/occasions/CreateModal';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const hasDraftOccasions = occasions.some(occasion => occasion.is_draft);

  const filterAndSortOccasions = useCallback(() => {
    let filteredOccasions = filterOccasions(currentFilter, occasions);

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredOccasions = filteredOccasions.filter(occasion =>
        (occasion.label?.toLowerCase() || '').includes(query) ||
        (occasion.type?.toLowerCase() || '').includes(query) ||
        (occasion.summary?.toLowerCase() || '').includes(query) ||
        (occasion.custom_input?.toLowerCase() || '').includes(query)
      );
    }

    const sortedOccasions = sortOccasions(currentSort, filteredOccasions);
    setOccasionsList(sortedOccasions);
  }, [occasions, currentFilter, currentSort, searchQuery]);

  useEffect(() => {
    if (router.isReady) {
      const sort = (router.query.sort as string) || OCCASION_SORTS.DATE_DESCENDING;
      setCurrentSort(sort as OCCASION_SORTS);

      // Set the filter from URL query if available
      const filter = (router.query.filter as string) || '';
      if (filter) {
        setCurrentFilter(filter);
      }

      // Set the search query from URL if available
      const search = router.query.search as string;
      if (search) {
        setSearchQuery(search);
      }

      // Check if openCreateModal query parameter is present
      if (router.query.openCreateModal === 'true') {
        setIsCreateModalOpen(true);
        // Remove the query parameter to avoid reopening the modal on refresh
        const { openCreateModal, ...restQuery } = router.query;
        router.replace({
          pathname: router.pathname,
          query: restQuery
        }, undefined, { shallow: true });
      }

      filterAndSortOccasions();
    }
  }, [router.isReady, router.query, occasions, filterAndSortOccasions]);

  useEffect(() => {
    filterAndSortOccasions();
  }, [currentFilter, currentSort, occasions, searchQuery, filterAndSortOccasions]);

  // Close mobile sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  // Check if backend server is running
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        console.log("Checking backend server status...");
        const response = await fetch(`${process.env.SERVER_URL}/`);
        console.log("Backend server response status:", response.status);
        if (!response.ok) {
          console.error("Backend server is not responding correctly. Status:", response.status);
        } else {
          console.log("Backend server is running correctly");
        }
      } catch (error) {
        console.error("Error connecting to backend server:", error);
      }
    };

    checkBackendStatus();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status !== 'loading' && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [status, isAuthenticated, router]);

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
    const today = new Date();

    // Handle timeframe filters
    if (filter === 'all' || filter === '') {
      return occasionsToFilter;
    }

    if (filter === 'upcoming') {
      return occasionsToFilter.filter(occasion => {
        const occasionDate = new Date(occasion.date);
        return occasionDate >= today && !occasion.is_draft;
      });
    }

    if (filter === 'this-week') {
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return occasionsToFilter.filter(occasion => {
        const occasionDate = new Date(occasion.date);
        return occasionDate >= today && occasionDate <= nextWeek && !occasion.is_draft;
      });
    }

    if (filter === 'this-month') {
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);
      return occasionsToFilter.filter(occasion => {
        const occasionDate = new Date(occasion.date);
        return occasionDate >= today && occasionDate <= nextMonth && !occasion.is_draft;
      });
    }

    if (filter === 'past') {
      return occasionsToFilter.filter(occasion => {
        const occasionDate = new Date(occasion.date);
        return occasionDate < today && !occasion.is_draft;
      });
    }

    // Handle occasion type filters
    if (filter === 'type-all') {
      return occasionsToFilter;
    }

    if (filter.startsWith('type-')) {
      const type = filter.replace('type-', '');
      return occasionsToFilter.filter(occasion =>
        occasion.type.toLowerCase() === type.toLowerCase()
      );
    }

    return occasionsToFilter;
  }

  function sortOccasions(sort: OCCASION_SORTS, occasionsToSort: Occasion[]): Occasion[] {
    if (sort === OCCASION_SORTS.DATE_ASCENDING) {
      return [...occasionsToSort].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    if (sort === OCCASION_SORTS.DATE_DESCENDING) {
      return [...occasionsToSort].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (sort === OCCASION_SORTS.TITLE_ASCENDING) {
      return [...occasionsToSort].sort((a, b) => a.label.localeCompare(b.label));
    }
    if (sort === OCCASION_SORTS.TITLE_DESCENDING) {
      return [...occasionsToSort].sort((a, b) => b.label.localeCompare(a.label));
    }
    if (sort === OCCASION_SORTS.TYPE_ASCENDING) {
      return [...occasionsToSort].sort((a, b) => a.type.localeCompare(b.type));
    }
    if (sort === OCCASION_SORTS.TYPE_DESCENDING) {
      return [...occasionsToSort].sort((a, b) => b.type.localeCompare(a.type));
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

  function handleFilterChange(filter: string) {
    setCurrentFilter(filter);

    // Update URL without redirecting
    router.push({
      pathname: router.pathname,
      query: { ...router.query, filter: filter },
    }, undefined, { shallow: true });

    // Apply the filter
    const filteredOccasions = filterOccasions(filter, occasions);
    const sortedOccasions = sortOccasions(currentSort, filteredOccasions);
    setOccasionsList(sortedOccasions);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);

    // Update URL without redirecting
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: e.target.value || undefined },
    }, undefined, { shallow: true });
  }

  function toggleMobileSidebar() {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
        <title>Occasion Alerts | Your Occasions Dashboard</title>
        <meta name="description" content="Manage all your important occasions in one place" />
      </Head>

      <div className="flex w-full overflow-x-hidden">
        <Sidebar
          activeFilter={currentFilter}
          onFilterChange={handleFilterChange}
          openCreateModal={() => setIsCreateModalOpen(true)}
          onToggleCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className={`flex-1 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} bg-gray-50 min-h-screen overflow-x-hidden transition-all duration-300`}>
          <div className="w-full px-6 py-8">
            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center mb-6">
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-800 focus:outline-none mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">Occasion Alerts</h1>
            </div>

            {/* Desktop header with title and search */}
            <div className="hidden md:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Occasion Alerts</h1>
                <p className="text-gray-600">Manage all your important occasions in one place</p>
              </div>

              <div className="flex items-center">
                <div className="relative mr-4">
                  <input
                    type="text"
                    placeholder="Search occasions..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Mobile-friendly layout */}
            <div className="md:hidden mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-2 relative">
                  <input
                    type="text"
                    placeholder="Search occasions..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-shrink-0 flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="sr-only">New</span>
                </button>
              </div>
            </div>

            {/* View controls - different for desktop and mobile */}
            <div className="md:flex md:items-center md:mb-6 hidden">
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
                <OccasionsSortDropdown onClick={handleSortChange} currentSort={currentSort} />
              </div>
            </div>

            {/* Mobile view controls */}
            <div className="flex flex-col space-y-4 mb-6 md:hidden">
              <div className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-2">
                <div className="flex-1 flex justify-start">
                  <button
                    onClick={() => setActiveView('list')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeView === 'list' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setActiveView('calendar')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeView === 'calendar' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Calendar View
                  </button>
                </div>
              </div>

              <div className="w-full bg-white rounded-lg shadow-sm p-2">
                <OccasionsSortDropdown onClick={handleSortChange} currentSort={currentSort} />
              </div>
            </div>

            {/* Stats cards - hidden on mobile, horizontally scrollable on desktop */}
            <div className="hidden md:block overflow-x-auto pb-4 mb-8 -mx-6 px-6">
              <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
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
                  className="w-60 flex-shrink-0"
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
                  className="w-60 flex-shrink-0"
                />

                <DashboardCard
                  title="Most Common"
                  subtitle={commonType.type ? `${commonType.type.charAt(0).toUpperCase() + commonType.type.slice(1)}` : 'None'}
                  value={commonType.count}
                  icon={
                    commonType.type === 'birthday' ? (
                      <span className="text-xl">🎂</span>
                    ) : commonType.type === 'anniversary' ? (
                      <span className="text-xl">💍</span>
                    ) : commonType.type === 'holiday' ? (
                      <span className="text-xl">🎄</span>
                    ) : commonType.type === 'graduation' ? (
                      <span className="text-xl">🎓</span>
                    ) : commonType.type === 'wedding' ? (
                      <span className="text-xl">👰</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    )
                  }
                  accentColor={
                    commonType.type === 'birthday' ? 'bg-yellow-500' :
                      commonType.type === 'anniversary' ? 'bg-pink-500' :
                        commonType.type === 'holiday' ? 'bg-green-500' :
                          commonType.type === 'graduation' ? 'bg-blue-500' :
                            commonType.type === 'wedding' ? 'bg-purple-500' :
                              'bg-orange-500'
                  }
                  onClick={() => commonType.type && setCurrentFilter(`type-${commonType.type}`)}
                  className="w-60 flex-shrink-0"
                />

                {/* Total Occasions card */}
                <DashboardCard
                  title="Total Occasions"
                  subtitle="All active occasions"
                  value={occasions.filter(o => !o.is_draft).length}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  }
                  accentColor="bg-purple-500"
                  onClick={() => setCurrentFilter('all')}
                  className="w-60 flex-shrink-0"
                />
              </div>
            </div>

            {activeView === 'list' ? (
              <div className="space-y-8">
                <UpcomingOccasionsList
                  occasions={occasionsList.filter(o => new Date(o.date) >= new Date() && !o.is_draft)}
                  deletionHandler={deletionHandler}
                  modifyHandler={modifyHandler}
                  openCreateModal={() => setIsCreateModalOpen(true)}
                />

                {hasDraftOccasions && (
                  <DraftOccasionsList
                    occasions={occasionsList.filter(o => o.is_draft)}
                    deletionHandler={deletionHandler}
                    fundHandler={fundHandler}
                    openCreateModal={() => setIsCreateModalOpen(true)}
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

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
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
