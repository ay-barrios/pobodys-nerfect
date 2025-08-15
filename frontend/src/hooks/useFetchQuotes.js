import { useCallback, useState, useEffect } from "react";

export default function useFetchQuotes() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/quotes");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setQuotes(data);
        } catch (e) {
            setError(e.message || "Failed to load quotes");
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        load()
    }, [load]);

    return { quotes, loading, error, reload: load };
}