import { useEffect, useState } from "react";

interface UseCertificateReturn {
    pdfData: ArrayBuffer | null;
    loading: boolean;
    error: Error | null;
}

export default function useCertificate(fileUrl: string): UseCertificateReturn {
    const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!fileUrl) {
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);

        fetch(fileUrl)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load PDF");
                return res.arrayBuffer();
            })
            .then((buffer) => {
                if (active) {
                    setPdfData(buffer);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (active) {
                    console.error(err);
                    setError(err as Error);
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [fileUrl]);

    return { pdfData, loading, error };
}
