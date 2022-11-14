import React from 'react';
import { type NextPage } from 'next';
import { trpc } from '@utils/trpc';
import { handleError, loadZxcvbn } from '@utils/client.util';
import { zxcvbn, zxcvbnOptions, type ZxcvbnResult } from '@zxcvbn-ts/core';
import { z } from 'zod';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Captcha } from '@components/ui/Captcha';

// Components
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { StrengthBar } from '@components/ui/StrengthBar';
import { Loading } from '@components/ui/Loading';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Toast } from '@components/ui/Toast';
import { TRPCError } from '@trpc/server';

// PNG
import { type ToastIntent } from '@utils/client.typing';

const SignupPage: NextPage = () => {
	const [pageLoad, setPageLoad] = React.useState(false);
	const [pwdStrength, setPwdStrength] = React.useState<ZxcvbnResult>(zxcvbn(''));
	const [showPage, setShowPage] = React.useState(0);
	const router = useRouter();

	// Hcaptch Token
	const [token, setToken] = React.useState<string>('');
	const captchaRef = React.useRef(null);

	// Required Toast State
	const [showToast, setShowToast] = React.useState(false);
	const [toastIntent, setToastIntent] = React.useState<ToastIntent>('success');
	const [toastMessage, setToastMessage] = React.useState('');

	//TRPC
	const mutation = trpc.user.signup.useMutation();

	const signupSchema = z.object({
		password: z
			.string()
			.min(8)
			.max(20)
			.refine(() => pwdStrength.score / 4 >= 0.75, {
				message: 'Password is too weak',
			}),
		acceptTerms: z.boolean().refine((v) => v, {
			message: 'You must accept the terms and conditions',
		}),
	});

	const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, touched } = useFormik({
		initialValues: {
			password: '',
			acceptTerms: false,
		},
		validationSchema: toFormikValidationSchema(signupSchema),
		onSubmit: async (values, actions) => {
			try {
				if (captchaRef.current) {
					const captcha = captchaRef.current as HCaptcha;
					captcha.execute();
					console.log(captcha.);
					if (token.length > 0) {
						actions.setSubmitting(true);
						const res = await mutation.mutateAsync({
							password: values.password,
							acceptTerms: values.acceptTerms,
							hCaptchaResponse: token,
						});
						setShowPage(1);
					}
				}
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
			loadOptions();
			setPageLoad(true);
		}
	}, []);

	React.useEffect(() => {
		const results = zxcvbn(values.password);
		setPwdStrength(results);
	}, [values.password]);

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
	}, []);

	async function loadOptions(): Promise<void> {
		console.log(`Loaded options.`);
		const options = await loadZxcvbn();
		zxcvbnOptions.setOptions(options);
		return Promise.resolve();
	}

	return (
		<main className="min-w-screen flex h-screen flex-col items-center justify-center overflow-hidden font-spacemono">
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
						<Captcha callback={setToken} refer={captchaRef} />
						<Button
							letterSpaced={true}
							disabled={isSubmitting || Object.keys(errors).length > 0}
							type="submit"
							onClick={() => {
								handleSubmit();
							}}>
							Signup
						</Button>
						<div
							className="my-2 cursor-pointer place-self-center text-center text-sm font-bold transition-all duration-300 hover:underline"
							onClick={() => {
								router.replace('/auth/login');
							}}>
							Login
						</div>
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
							You have successfully signed up. Here is your username: <b>{mutation.data?.username}</b>
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

export default SignupPage;
