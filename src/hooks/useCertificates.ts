import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export interface CertificateTranslation {
  title: string;
  description: string;
  skills: string[];
}

export interface Certificate {
  id: string;
  issuer: string;
  year: string;
  preview: string;
  skills: string[];
  certification_translations?: CertificateTranslation[];
}

export default function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const res = await fetch(`/api/certificates/all?lang=${lang}`);
        const json = await res.json();
        setCertificates((json?.data as Certificate[]) || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificate();
  }, [lang]);

  return { certificates, loading, error, lang };
}
