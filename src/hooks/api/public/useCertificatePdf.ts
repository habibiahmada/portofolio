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

        const abortController = new AbortController();
        setLoading(true);

        fetch(fileUrl, { signal: abortController.signal })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load PDF");
                return res.arrayBuffer();
            })
            .then((buffer) => {
                if (!abortController.signal.aborted) {
                    setPdfData(buffer);
                    setLoading(false);
                }
            })
            .catch((err) => {
                // Don't set error if request was aborted
                if (!abortController.signal.aborted && err.name !== 'AbortError') {
                    console.error(err);
                    setError(err as Error);
                    setLoading(false);
                }
            });

        return () => {
            abortController.abort();
        };
    }, [fileUrl]);

    return { pdfData, loading, error };
}
