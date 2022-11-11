import React from 'react';
import { type NextPage } from 'next';

const Home: NextPage = () => {
  const [pageLoad, setPageLoad] = React.useState(false);

  React.useEffect(() => {
    if (!pageLoad) {
      setPageLoad(true);
    }
  }, []);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center font-spacemono"></main>
  );
};

export default Home;
