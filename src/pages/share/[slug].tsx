import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { trpc } from '@utils/trpc';
import Link from 'next/link';
import { formatDate } from '@utils/client.util';

const SharePage = () => {
  const router = useRouter();
  const noteId = router.query.slug;

  const getSharedNote = trpc.post.getSharedPost.useQuery(
    {
      id: noteId as string,
    },
    {
      enabled: !!noteId,
    },
  );

  return (
    <motion.div
      className="font-monospace fixed top-0 left-0 z-[998] flex h-screen w-screen font-spacemono bg-white text-black"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.5 }}
    >
      <NextSeo
        title="Shared Note"
        nofollow={true}
        noindex={true}
        robotsProps={{
          nosnippet: true,
          noarchive: true,
        }}
      />
      <div className="fixed top-0 left-0 flex h-[60px] w-full justify-between p-5">
        <div className="flex gap-5 items-center">
          {getSharedNote.data && (
            <>
              <span className="text-sm">
                {formatDate(getSharedNote.data.at, 'includeTime')}
              </span>
              <span className="text-sm font-bold">
                by {getSharedNote.data.User?.username}
              </span>
            </>
          )}
        </div>
        <Link href="/">home.</Link>
      </div>
      {!getSharedNote.error ? (
        <textarea
          readOnly={true}
          className="h-screen w-full resize-none border-none p-20 focus:border-white focus:ring-0"
          minLength={20}
          maxLength={3000}
          value={getSharedNote.data?.text}
        />
      ) : (
        <div className="flex h-screen w-full items-center justify-center">
          <h1 className="text-3xl font-bold text-home">Note not found.</h1>
        </div>
      )}
      {getSharedNote.isLoading && (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-white bg-opacity-50">
          <h1 className="text-3xl font-bold text-home">Loading...</h1>
        </div>
      )}
    </motion.div>
  );
};

export default SharePage;
