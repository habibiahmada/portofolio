import { forwardRef } from 'react';
import ReCaptcha, { ReCaptchaHandle } from "../../reCaptcha";

interface Props {
    theme?: string;
    onVerify: (token: string) => void;
    onExpired?: () => void;
    onError?: () => void;
}

const ContactRecaptcha = forwardRef<ReCaptchaHandle, Props>(
    ({ theme, onVerify, onExpired, onError }, ref) => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

        if (!siteKey) {
            return <p className="text-sm text-red-500">Missing reCAPTCHA site key</p>;
        }

        return (
            <ReCaptcha
                ref={ref}
                siteKey={siteKey}
                onVerify={onVerify}
                onExpired={onExpired}
                onError={onError}
                theme={theme === 'dark' ? 'dark' : 'light'}
            />
        );
    }
);

ContactRecaptcha.displayName = 'ContactRecaptcha';

export default ContactRecaptcha;
