import React from 'react';
import { useRouter } from 'next/router';
import Detail from '../components/Detail';

const Home: React.FC = () => {
  const router = useRouter();

  return (
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
  );
};

export default Home;