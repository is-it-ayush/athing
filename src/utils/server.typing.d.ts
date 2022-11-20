export type CaptchaResponse = {
    success: boolean;
    challenge_ts: string;
    hostname: string;
    credit: boolean;
    'error-codes': string[];
    sitekey: string;
}