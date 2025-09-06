export async function getMessages(locale: string) {
    try {
      return (await import(`../../messages/${locale}.json`)).default;
    } catch (error) {
      console.error("No messages found for locale:", locale);
      return null;
    }
  }
  