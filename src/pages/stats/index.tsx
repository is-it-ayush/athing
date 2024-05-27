import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { prisma } from '@server/db/client';
import type { StatisticsProps } from '@utils/client.typing';
import { IoArrowBack } from 'react-icons/io5';
import { formatNumber } from '@utils/client.util';

const StatsPage = ({ stats }: { stats: StatisticsProps }) => {
  const router = useRouter();

  return (
    <motion.div
      className={`flex h-screen w-screen flex-col items-center justify-center bg-opacity-[10%] bg-clouds-pattern p-10 font-spacemono font-semibold text-black`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NextSeo
        title="Statistics"
        description="The Server Statistics Of A Thing."
      />
      <div className="absolute top-10 left-10 flex">
        <button
          className="rounded-full border-2 bg-white p-2 text-black transition-colors duration-200 hover:bg-black hover:text-white"
          onClick={() => router.back()}
        >
          <IoArrowBack className="h-10 w-10" />
        </button>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col border-2 border-gray-300 bg-white p-5 hover:border-black">
          <h1 className="text-2xl">Total User Count</h1>
          <div className="flex flex-row items-end gap-2">
            <h3 className="mt-2 flex text-5xl font-bold">
              {formatNumber(stats.totalUserCount)}
            </h3>
            <p className="flex text-sm">Total Users</p>
          </div>
        </div>
        <div className="flex flex-col border-2 border-gray-300 bg-white p-5 hover:border-black">
          <h1 className="text-2xl">Daily Sign Up&apos;s</h1>
          <div className="flex flex-row items-end gap-2">
            <h3 className="mt-2 flex text-5xl font-bold">
              {formatNumber(stats.last24HoursUserCount)}
            </h3>
            <p className="flex text-sm">Users ( -24 hours)</p>
          </div>
        </div>
        <div className="flex flex-col border-2 border-gray-300 bg-white p-5 hover:border-black">
          <h1 className="text-2xl">Total Notes</h1>
          <div className="flex flex-row items-end gap-2">
            <h3 className="mt-2 flex text-5xl font-bold">
              {formatNumber(stats.postCount)}
            </h3>
            <p className="flex text-sm">Notes</p>
          </div>
        </div>
        <div className="flex flex-col border-2 border-gray-300 bg-white p-5 hover:border-black">
          <h1 className="text-2xl">Total Journals</h1>
          <div className="flex flex-row items-end gap-2">
            <h3 className="mt-2 flex text-5xl font-bold">
              {formatNumber(stats.journalCount)}
            </h3>
            <p className="flex text-sm">Journals</p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 flex w-full items-center justify-center bg-white font-normal">
        <p className="flex text-center">
          Note: The data is precise and is calculated directly off the database
          every 30 minutes.
        </p>
      </div>
    </motion.div>
  );
};

export const getStaticProps = async () => {
  /**
   * Get the stats from the database
   * We can do it directly because the code never runs on client side.
   * This is server side code which revalidate every 30 minutes with new data.
   * @type {StatisticsProps}
   */
  const totalUserCount = await prisma.user.count();
  const last24HoursUserCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      },
    },
  });
  const postCount = await prisma.post.count({ where: { isPublished: true } });
  const journalCount = await prisma.journal.count({
    where: { isPublic: true },
  });

  const stats = {
    totalUserCount,
    last24HoursUserCount,
    postCount,
    journalCount,
  } as StatisticsProps;

  return {
    props: {
      stats,
    },
    revalidate: 60 * 30, // 30 Minutes
  };
};

export default StatsPage;
