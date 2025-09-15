import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Await requestLocale untuk Next.js 15 compatibility
  const requested = await requestLocale;
  
  // Validasi dan fallback locale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    // Tambahkan error handling untuk messages
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});