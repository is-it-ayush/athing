// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  style-src 'self';
  font-src 'self' fonts.google.com;  
`;

// Cool Security Headers.
const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block',
	},
	{
		key: 'X-Frame-Options', // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
		value: 'SAMEORIGIN',
	},
	{
		key: 'X-Content-Type-Options', // Block the browser from trying to guess the MIME type.
		value: 'nosniff',
	},
	{
		key: 'Referrer-Policy',
		value: 'strict-origin-when-cross-origin', // https://scotthelme.co.uk/a-new-security-header-referrer-policy/
	},
	{
		key: 'Content-Security-Policy',
		value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
	},
];

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	async redirects() {
		return [
			{
				source: '/',
				has: [
					{
						type: 'cookie',
						key: 'token',
					},
				],
				permanent: false,
				destination: '/app',
			},
		];
	},
};
export default config;
