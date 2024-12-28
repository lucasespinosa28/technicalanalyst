import { useState, useEffect } from 'react';

interface GeckoTerminalData200 {
    data: {
        id: string,
        type: string,
        attributes: {
            ohlcv_list: number[][]
        }
    },
    meta: {
        base: {
            address: string,
            name: string,
            symbol: string,
            coingecko_coin_id: string
        },
        quote: {
            address: string,
            name: string,
            symbol: string,
            coingecko_coin_id: string
        }
    }
}

interface GeckoTerminalData422 {
    errors: [
        {
            status: string,
            title: string
        }
    ]
}

type GeckoTerminalResponse = { data: GeckoTerminalData200; status: 200 } | { data: GeckoTerminalData422; status: 422 };

export const useGeckoTerminalData = (pool_address: string, timeframe: string, aggregate: number, limit: number) => {
    const url = `https://api.geckoterminal.com/api/v2/networks/cro/pools/${pool_address}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}`;
    const [response, setResponse] = useState<GeckoTerminalResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchResponse = await fetch(url);
                const result = await fetchResponse.json();

                if (fetchResponse.status === 200) {
                    setResponse({ data: result as GeckoTerminalData200, status: 200 });
                } else if (fetchResponse.status === 422) {
                    setResponse({ data: result as GeckoTerminalData422, status: 422 });
                } else {
                    throw new Error(`Unexpected status code: ${fetchResponse.status}`);
                }
            } catch (error) {
                setError('An error occurred while fetching the data:' + error);
            }
            setLoading(false);
        };

        fetchData();
    }, [url]);

    return { response, loading, error };
};