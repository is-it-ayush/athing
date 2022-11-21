import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '@utils/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useFormik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { setCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

// Components
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Loading } from '@components/ui/Loading';
import { Toast } from '@components/ui/Toast';
import { handleError } from '@utils/client.util';

// Types
import { showToastAtom, toastIntentAtom, toastMessageAtom } from '@utils/store';

const LoginPage: NextPage = () => {
	const params = useSearchParams();
	const router = useRouter();

	// Required Toast State
	const [showToast, setShowToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	//TRPC
	const mutation = trpc.user.login.useMutation();

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		if (errors.username || errors.password) {
			setToastIntent('error');
			setToastMessage('Please check your username and password');
			setShowToast(true);
			return;
		}

		try {
			// [DEBUG] Calculate Time
			// const start = Date.now();

			const res = await mutation.mutateAsync({
				username: values.username.trim(),
				password: values.password.trim(),
				rememberMe: values.rememberMe,
			});

			// Set the cookie on the client side.
			setCookie(null, 'token', res.token, {
				maxAge: values.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
				path: '/',
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
			});

			setToastIntent('success');
			setToastMessage('Successfully logged in!');
			setShowToast(true);

			setTimeout(() => {
				router.push('/app');
			}, 1000);

			// Redirect to the app.
		} catch (err: TRPCError | any) {
			console.log(err);
			const errorMessage = (await handleError(err)) as string;
			setToastIntent('error');
			setToastMessage(errorMessage);
			setShowToast(true);
		}
	};

	// Zod Schema for form input validation
	const loginSchema = z.object({
		username: z
			.string()
			.trim()
			.min(3)
			.max(20)
			.regex(/^[a-zA-Z0-9_-]+$/),
		password: z.string().trim().min(8).max(30),
		rememberMe: z.boolean(),
	});

	// Formik hook for form validation and control.
	const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			username: params.get('username') || '',
			password: '',
			rememberMe: false,
		},
		validationSchema: toFormikValidationSchema(loginSchema),
		onSubmit,
	});

	React.useEffect(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				handleSubmit();
			}
		});

		// Cleanup: Remove the event listener on unmount.
		return () => {
			document.removeEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					handleSubmit();
				}
			});
		};
	});

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
					transition={{ duration: 0.3 }}>
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
						label="Remember me for 7 days."
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
					<div
						className="my-2 cursor-pointer place-self-center text-sm font-bold transition-all duration-300 hover:underline"
						onClick={() => {
							router.replace('/auth/signup');
						}}>
						Signup
					</div>
				</motion.div>
				{showToast ? <Toast key="toastKey" /> : null}
			</AnimatePresence>
		</main>
	);
};

export default LoginPage;
