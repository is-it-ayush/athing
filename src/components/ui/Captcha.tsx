import { useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export type CaptchaProps = {
	callback: React.Dispatch<React.SetStateAction<string>>;
	refer: React.MutableRefObject<HCaptcha | null>;
};

export const Captcha = ({ callback, refer }: CaptchaProps) => {
	const [onLoad, setOnLoad] = useState<boolean>(false);
	const [sitekey, setSitekey] = useState<string>('');

	useEffect(() => {
		if (!onLoad) {
			const key = process.env.NEXT_PUBLIC_SITE_KEY;
			if (key) {
				setSitekey(key);
			}
			setOnLoad(true);
		}
	});

	function onCaptchaError() {
		console.log('[Debug] Captcha error. You should show the toast.');
	}

	function onCaptchaLoad() {
		console.log('[Debug] Captcha loaded.');
	}

	async function onHCaptchaChange(captchaCode: string) {
		if (!captchaCode) {
			return;
		}
		callback(captchaCode);
	}

	return (
		<div>
			<HCaptcha
				ref={refer}
				size="invisible"
				id="h-captcha"
				onLoad={onCaptchaLoad}
				onError={onCaptchaError}
				key="h-captcha-key"
				sitekey={sitekey}
				onExpire={() => {
					console.log('[Debug] Captcha expired.');
				}}
				onVerify={onHCaptchaChange}
			/>
		</div>
	);
};
