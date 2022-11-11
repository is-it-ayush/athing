import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next/types';
import React from 'react';

const AuthPage: NextPage = () => {
  // Redirect if user is already logged in.
  const router = useRouter();
  const cookies = parseCookies();

  React.useEffect(() => {
    if (cookies.token && cookies.token != null) {
      router.push('/app');
    } else {
      router.push('/auth/login');
    }
  }, []);

  return null;
};

export default AuthPage;
