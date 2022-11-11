import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '@utils/trpc';
import { loadZxcvbn } from '@utils/client.util';
import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';
import { z } from 'zod';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

// Components
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { StrengthBar } from '@components/ui/StrengthBar';
import { Loading } from '@components/ui/Loading';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// PNG

const SignupPage: NextPage = () => {
  const [pageLoad, setPageLoad] = React.useState(false);
  const [pwdStrength, setPwdStrength] = React.useState<ZxcvbnResult>(zxcvbn(''));
  const [showPage, setShowPage] = React.useState(0);
  const router = useRouter();

  //TRPC
  const mutation = trpc.user.signup.useMutation();

  const signupSchema = z.object({
    password: z
      .string()
      .min(8)
      .max(20)
      .refine((v) => pwdStrength.score / 4 >= 0.75, {
        message: 'Password is too weak',
      }),
    acceptTerms: z.boolean().refine((v) => v, {
      message: 'You must accept the terms and conditions',
    }),
  });

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, touched } =
    useFormik({
      initialValues: {
        password: '',
        acceptTerms: false,
      },
      validationSchema: toFormikValidationSchema(signupSchema),
      onSubmit: async (values, actions) => {
        actions.setSubmitting(true);
        await mutation.mutateAsync({
          password: values.password,
        });
        setShowPage(1);
      },
    });

  React.useEffect(() => {
    if (!pageLoad) {
      loadOptions();
      setPageLoad(true);
    }
  }, []);

  React.useEffect(() => {
    let results = zxcvbn(values.password);
    setPwdStrength(results);
  }, [values.password]);

  async function loadOptions(): Promise<void> {
    console.log(`Loaded options.`);
    let options = await loadZxcvbn();
    zxcvbnOptions.setOptions(options);
    return Promise.resolve();
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center font-spacemono">
      <div className="flex">
        <AnimatePresence>{mutation.isLoading && <Loading />}</AnimatePresence>
      </div>
      <AnimatePresence>
        {showPage === 0 ? (
          <motion.div
            className="flex min-w-[250px] flex-col p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="my-2 text-4xl font-bold">Sign Up</h1>
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
            <StrengthBar strength={pwdStrength.score} />
            <Input
              label="I accept the terms and conditions."
              type="checkbox"
              intent="default"
              id="acceptTerms"
              checked={values.acceptTerms}
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
              Signup
            </Button>
          </motion.div>
        ) : showPage === 1 ? (
          <motion.div
            className="flex min-w-[250px] flex-col p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="code my-2 text-center text-4xl font-bold">Welcome!</h1>
            <p className="prose my-2 text-center">
              You have successfully signed up. Here is your username:{' '}
              <b>{mutation.data?.username}</b>
            </p>
            <Button
              letterSpaced={true}
              type="button"
              onClick={() => {
                router.push(`/auth/login?username=${mutation.data?.username}`);
              }}>
              Login
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
};

export default SignupPage;
