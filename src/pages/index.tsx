import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router'
import { Occasion, OCCASION_SORTS } from '@/types/occasions'
import { GetServerSideProps } from 'next'
import { NextApiRequest } from 'next';
import Head from 'next/head';
import toast from 'react-hot-toast';

import { OCCASION_FILTERS } from '@/types/occasions'
import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/occasions/DashboardCard';
import OccasionsSortDropdown from '@/components/occasions/SortDropdown';
import PastOccasionsList from '@/components/occasions/PastOccasionsList';
import DraftOccasionsList from '@/components/occasions/DraftOccasionList';
import UpcomingOccasionsList from '@/components/occasions/UpcomingOccasionsList';
import CreateModal from '@/components/occasions/CreateModal';
import ModifyModal from '@/components/occasions/ModifyModal';
import CalendarView from '@/components/occasions/CalendarView';
import OccasionDetailsModal from '@/components/occasions/OccasionDetailsModal';
import { getAccessToken } from '@/utils/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useOccasions } from '@/hooks/useOccasions';
import Link from 'next/link';
import Image from 'next/image';

export default function OccasionsPage({ initialOccasions }: { initialOccasions: Occasion[] }) {
  const router = useRouter()
  const { session, status, refreshSession } = useAuthSession()
  const isAuthenticated = !!session
  const hasCredits = (session?.user?.credits ?? 0) > 0;

  // Use our new hook for fetching occasions data
  const { occasions: fetchedOccasions, isLoading, refetch: refreshOccasionsQuery } = useOccasions();

  // Combine initial occasions with fetched occasions, preferring fetched ones when available
  const [occasions, setOccasions] = useState<Occasion[]>(initialOccasions);
  const [occasionsList, setOccasionsList] = useState<Occasion[]>([]);

  // Separate sort states for upcoming and past occasions
  const [upcomingSort, setUpcomingSort] = useState<OCCASION_SORTS>(OCCASION_SORTS.DATE_ASCENDING);
  const [pastSort, setPastSort] = useState<OCCASION_SORTS>(OCCASION_SORTS.DATE_DESCENDING);

  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedOccasionId, setSelectedOccasionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Update occasions state when fetchedOccasions changes
  useEffect(() => {
    if (fetchedOccasions && fetchedOccasions.length > 0) {
      setOccasions(fetchedOccasions);
    }
  }, [fetchedOccasions]);

  const hasDraftOccasions = occasions.some(occasion => occasion.is_draft);

  // Function to refresh occasions list
  const refreshOccasions = useCallback(() => {
    // Use the refetch function from our hook
    refreshOccasionsQuery();
  }, [refreshOccasionsQuery]);

  // Refresh user credits in the background without affecting the UI
  const refreshUserCredits = useCallback(() => {
    // Use setTimeout to ensure this runs after the current render cycle
    setTimeout(() => {
      refreshSession().catch(err => {
        console.error('Error refreshing session:', err);
      });
    }, 100);
  }, [refreshSession]);

  // Function to handle opening the create modal with credit check
  const handleOpenCreateModal = useCallback(() => {
    if (hasCredits) {
      setIsCreateModalOpen(true);
    } else {
      toast.error(
        <div className="flex flex-col">
          <span>You need credits to create occasions.</span>
          <button
            className="text-orange-500 font-medium underline mt-1 text-sm"
            onClick={() => router.push('/credits')}
          >
            Purchase credits
          </button>
        </div>
      );
    }
  }, [hasCredits, router]);

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

    // We no longer sort here since we'll sort separately for each section
    setOccasionsList(filteredOccasions);
  }, [occasions, currentFilter, searchQuery]);

  useEffect(() => {
    if (router.isReady) {
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

      // Set the sort from URL query if available
      const upcomingSort = (router.query.upcomingSort as string) || OCCASION_SORTS.DATE_ASCENDING;
      const pastSort = (router.query.pastSort as string) || OCCASION_SORTS.DATE_DESCENDING;
      setUpcomingSort(upcomingSort as OCCASION_SORTS);
      setPastSort(pastSort as OCCASION_SORTS);

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

      // Check if openModifyModal query parameter is present
      if (router.query.openModifyModal === 'true' && router.query.occasionId) {
        const occasionId = parseInt(router.query.occasionId as string, 10);
        if (!isNaN(occasionId)) {
          setSelectedOccasionId(occasionId);
          setIsModifyModalOpen(true);
          // Remove the query parameters to avoid reopening the modal on refresh
          const { openModifyModal, occasionId: id, ...restQuery } = router.query;
          router.replace({
            pathname: router.pathname,
            query: restQuery
          }, undefined, { shallow: true });
        }
      }

      filterAndSortOccasions();
    }
  }, [router.isReady, router.query, occasions, filterAndSortOccasions]);

  useEffect(() => {
    filterAndSortOccasions();
  }, [currentFilter, occasions, searchQuery, filterAndSortOccasions]);

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

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Occasion Alerts | Never Miss an Important Occasion</title>
          <meta name="description" content="Occasion Alerts helps you remember and prepare for all your important occasions. Never miss a birthday, anniversary, or special event again." />
        </Head>

        <div className="min-h-screen bg-white">
          {/* Navbar */}
          <nav className="w-full bg-white shadow-sm">
            <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <svg className="h-8 w-8 text-orange-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <span className="text-2xl font-bold text-orange-500">Occasion Alerts</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/login')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="w-full relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 py-16">
            <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto">
              <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                <div className="lg:max-w-2xl">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                    <span className="block">Never Miss a</span>
                    <span className="block text-orange-500">Special Occasion</span>
                    <span className="block">Again</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Get timely reminders for birthdays, anniversaries, holidays, and more. Occasion Alerts makes sure you&apos;re always prepared for life&apos;s special moments.
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <button
                          onClick={() => router.push('/signup')}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10"
                        >
                          Get started
                        </button>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <button
                          onClick={() => router.push('/login')}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 md:py-4 md:text-lg md:px-10"
                        >
                          Log in
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 relative lg:mt-0 lg:flex lg:items-center">
                  <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-xl">
                    <div className="relative block w-full bg-white rounded-lg overflow-hidden group">
                      <Image
                        src="/dashboard-preview.png"
                        alt="Dashboard preview"
                        className="w-full transition-transform duration-300 group-hover:scale-105"
                        width={600}
                        height={400}
                      />
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => router.push('/signup')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 animate-bounce"
                        >
                          Try it now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Splash Section with gradient */}
          <div className="w-full py-16 bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50">
            <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Join thousands already using Occasion Alerts
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                The smart way to remember important dates and celebrate special moments
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="w-full py-16 bg-white">
            <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Keep track of all your important dates and never forget a special moment
                </p>
              </div>

              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Track Occasions Card */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center">Track Occasions</h3>
                  <p className="mt-4 text-gray-600 text-center">
                    Easily add birthdays, anniversaries, and other special dates to your calendar.
                  </p>
                </div>

                {/* Get Reminders Card */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center">Get Reminders</h3>
                  <p className="mt-4 text-gray-600 text-center">
                    Receive timely notifications before important dates so you&apos;re always prepared.
                  </p>
                </div>

                {/* AI Messages Card */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center">AI Messages</h3>
                  <p className="mt-4 text-gray-600 text-center">
                    Send personalized, AI-generated messages for every occasion without the stress.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orange CTA Section */}
          <div className="w-full py-16 bg-orange-500 text-white">
            <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto text-center">
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                Ready to Never Miss an Occasion?
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto mb-8">
                Join thousands of people who use OccasionAlerts to stay connected with their loved ones.
              </p>
              <button
                onClick={() => router.push('/signup')}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 shadow-sm"
              >
                Get Started for Free
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full bg-white py-8">
            <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <svg className="h-5 w-5 text-orange-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500 text-sm">© 2025 OccasionAlerts.com</span>
                </div>
                <div className="flex space-x-6">
                  <Link href="/privacy-policy" className="text-gray-500 hover:text-orange-500 text-sm">Privacy Policy</Link>
                  <Link href="mailto:support@mg.occasionalerts.com" className="text-gray-500 hover:text-orange-500 text-sm">Contact</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  }

  async function deletionHandler(occasion_id: number) {
    const response = await fetch(`/api/occasions/${occasion_id}/delete`);
    if (response.ok) {
      refreshOccasions();
      // Refresh credits in the background
      refreshUserCredits();
    }
  }

  async function modifyHandler(occasion_id: number) {
    setSelectedOccasionId(occasion_id);
    setIsModifyModalOpen(true);
  }

  async function fundHandler(occasion_id: number) {
    const response = await fetch(`/api/occasions/${occasion_id}/fund`);
    if (response.ok) {
      refreshOccasions();
      // Refresh credits in the background since funding affects credits
      refreshUserCredits();
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

  function handleUpcomingSortChange(sort: OCCASION_SORTS) {
    setUpcomingSort(sort);

    // Update URL without redirecting
    router.push({
      pathname: router.pathname,
      query: { ...router.query, upcomingSort: sort },
    }, undefined, { shallow: true });
  }

  function handlePastSortChange(sort: OCCASION_SORTS) {
    setPastSort(sort);

    // Update URL without redirecting
    router.push({
      pathname: router.pathname,
      query: { ...router.query, pastSort: sort },
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
    setOccasionsList(filteredOccasions);
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

  // Handle occasion click in calendar view
  const handleOccasionClick = (occasion: Occasion) => {
    setSelectedOccasion(occasion);
    setIsDetailsModalOpen(true);
  };

  // Get upcoming and past occasions with their respective sorts
  const today = new Date();
  const upcomingOccasions = sortOccasions(
    upcomingSort,
    occasionsList.filter(o => new Date(o.date) >= today && !o.is_draft)
  );

  const pastOccasions = sortOccasions(
    pastSort,
    occasionsList.filter(o => new Date(o.date) < today && !o.is_draft)
  );

  const draftOccasions = occasionsList.filter(o => o.is_draft);

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
          openCreateModal={handleOpenCreateModal}
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

            {/* Zero-credit banner */}
            {isAuthenticated && session?.user?.credits === 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-800">
                      You&apos;re out of credits! You need credits to create new occasions.{' '}
                      <button
                        onClick={() => router.push('/credits')}
                        className="font-medium underline text-orange-800 hover:text-orange-900"
                      >
                        Purchase more credits
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  onClick={handleOpenCreateModal}
                  disabled={!hasCredits}
                  className={`flex items-center px-4 py-2 ${hasCredits
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                    } text-white rounded-lg transition-colors shadow-sm`}
                  title={!hasCredits ? "You need credits to create occasions" : ""}
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
                  onClick={handleOpenCreateModal}
                  disabled={!hasCredits}
                  className={`flex-shrink-0 flex items-center px-4 py-2 ${hasCredits
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                    } text-white rounded-lg transition-colors shadow-sm`}
                  title={!hasCredits ? "You need credits to create occasions" : ""}
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
                {/* Upcoming Occasions Section with its own sort control */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Upcoming Occasions</h2>
                    <OccasionsSortDropdown onClick={handleUpcomingSortChange} currentSort={upcomingSort} />
                  </div>
                  <UpcomingOccasionsList
                    occasions={upcomingOccasions}
                    deletionHandler={deletionHandler}
                    modifyHandler={modifyHandler}
                    openCreateModal={() => setIsCreateModalOpen(true)}
                  />
                </div>

                {/* Draft Occasions Section */}
                {hasDraftOccasions && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Draft Occasions</h2>
                    <DraftOccasionsList
                      occasions={draftOccasions}
                      deletionHandler={deletionHandler}
                      fundHandler={fundHandler}
                      openCreateModal={() => setIsCreateModalOpen(true)}
                    />
                  </div>
                )}

                {/* Past Occasions Section with its own sort control */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Past Occasions</h2>
                    <OccasionsSortDropdown onClick={handlePastSortChange} currentSort={pastSort} />
                  </div>
                  <PastOccasionsList
                    occasions={pastOccasions}
                  />
                </div>
              </div>
            ) : (
              <CalendarView
                occasions={occasionsList}
                onOccasionClick={handleOccasionClick}
              />
            )}
          </div>
        </main>
      </div>

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refreshOccasions();
          // After creating an occasion, refresh the credits in the background
          refreshUserCredits();
        }}
      />

      <ModifyModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        occasionId={selectedOccasionId}
        onSuccess={refreshOccasions}
      />

      <OccasionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        occasion={selectedOccasion}
        onDelete={deletionHandler}
        onModify={modifyHandler}
        onFund={fundHandler}
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
