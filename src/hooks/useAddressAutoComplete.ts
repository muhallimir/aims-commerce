import { useState, useEffect } from "react";

const useAddressAutoComplete = (query: string) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
                        query
                    )}&limit=10`
                );
                const data = await response.json();

                if (Array.isArray(data)) {
                    setSuggestions(data);
                } else {
                    setSuggestions([]);
                    console.error("LocationIQ error:", data);
                }
            } catch (error) {
                console.error("Error fetching address suggestions", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return { suggestions, loading };
};

export default useAddressAutoComplete;
