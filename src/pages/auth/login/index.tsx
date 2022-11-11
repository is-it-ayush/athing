import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useSearchParams } from 'next/navigation';

// Components
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Loading } from '@components/ui/Loading';
import { AnimatePresence } from 'framer-motion';

// PNG

const LoginPage: NextPage = () => {
  const [pageLoad, setPageLoad] = React.useState(false);
  const params = useSearchParams();

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
        const res = await mutation.mutateAsync({
          username: values.username,
          password: values.password,
          rememberMe: values.rememberMe,
        });
        console.log(res);
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
        <AnimatePresence></AnimatePresence>
      </div>
      <div className="flex min-w-[250px] flex-col">
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
      </div>
    </main>
  );
};

export default LoginPage;
