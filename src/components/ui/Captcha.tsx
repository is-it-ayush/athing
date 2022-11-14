import { useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export type CaptchaProps = {
    callback: React.Dispatch<React.SetStateAction<string>>;
}

export const Captcha = ({ callback }: CaptchaProps) => {
	
	const [onLoad, setOnLoad] = useState<boolean>(false);
	const [sitekey, setSitekey] = useState<string>('');
	const captchaRef = useRef(null);

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

	return (
		<div>
			<HCaptcha ref={captchaRef} size="invisible" onError={onCaptchaError} sitekey={sitekey} onVerify={(token) => callback(token)} />
		</div>
	);
};
