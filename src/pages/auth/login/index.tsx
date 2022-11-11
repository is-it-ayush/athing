import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { TRPCError } from '@trpc/server';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

// Components
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Loading } from '@components/ui/Loading';
import { Toast, ToastIntent } from '@components/ui/Toast';
import { handleError } from '@utils/client.util';

// PNG

const LoginPage: NextPage = () => {
  const [pageLoad, setPageLoad] = React.useState(false);
  const params = useSearchParams();

  // Required Toast State
  const [showToast, setShowToast] = React.useState(false);
  const [toastIntent, setToastIntent] = React.useState<ToastIntent>('success');
  const [toastMessage, setToastMessage] = React.useState('');

  //TRPC
  const mutation = trpc.user.login.useMutation();

  const loginSchema = z.object({
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-z0-9]+$/),
    password: z.string().min(8).max(20),
    rememberMe: z.boolean(),
  });

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, touched } =
    useFormik({
      initialValues: {
        username: params.get('username') || '',
        password: '',
        rememberMe: false,
      },
      validationSchema: toFormikValidationSchema(loginSchema),
      onSubmit: async (values, actions) => {
        try {
          const res = await mutation.mutateAsync({
            username: values.username,
            password: values.password,
            rememberMe: values.rememberMe,
          });

          // Set the cookie on the client side.
          setCookie(null, 'token', res.token, {
            maxAge: values.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });

          // Little hack to make sure the cookie is set before we redirect.

          setToastIntent('success');
          setToastMessage('Successfully logged in!');
          setShowToast(true);
        } catch (err: TRPCError | any) {
          const errorMessage = (await handleError(err)) as string;
          setToastIntent('error');
          setToastMessage(errorMessage);
          setShowToast(true);
        }
      },
    });

  React.useEffect(() => {
    if (!pageLoad) {
      setPageLoad(true);
    }
  }, []);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center font-spacemono">
      <div className="flex">
        <AnimatePresence>{mutation.isLoading && <Loading />}</AnimatePresence>
      </div>
      <AnimatePresence>
        <motion.div
          className="flex min-w-[250px] flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}>
          <h1 className="my-2 text-4xl font-bold">Log In</h1>
          <Input
            label="Username"
            type="text"
            intent="default"
            id="username"
            fullWidth={true}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="Password"
            type="password"
            intent="default"
            id="password"
            fullWidth={true}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="Remember me for 30 days."
            type="checkbox"
            intent="default"
            id="rememberMe"
            checked={values.rememberMe}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Button
            letterSpaced={true}
            disabled={isSubmitting || Object.keys(errors).length > 0}
            type="submit"
            onClick={() => {
              handleSubmit();
            }}>
            Log In
          </Button>
        </motion.div>
        {showToast ? (
          <Toast
            key="toastKey"
            intent={toastIntent}
            message={toastMessage}
            onClose={() => {
              setShowToast(!showToast);
            }}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
};

export default LoginPage;
