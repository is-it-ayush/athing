import { NextPage } from 'next/types';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import React from 'react';

const AuthPage: NextPage = () => {
  // Redirect to login if cookie is not set.
  const cookies = parseCookies();
  const router = useRouter();

  React.useEffect(() => {
    if (!cookies.token) {
      router.replace('/auth/login');
    } else {
      router.replace('/');  
    }
  }, []);

  return null;
};

export default AuthPage;
