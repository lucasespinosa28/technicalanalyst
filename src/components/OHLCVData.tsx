import React, { useEffect, useState } from 'react';
import { FormData } from './FormData';
import { GeckoTerminalData, OhlcvData } from './GeckoTerminalData';
import { unixToDate } from './unixToDate';
import { formatTokenPrice } from './formatTokenPrice';


interface GeckoTerminalFetch extends FormData {
  id: string;
  setGeckoTerminalData: (geckoTerminalData: OhlcvData[] | null) => void;
}
const OHLCVData: React.FC<GeckoTerminalFetch> = ({ id,setGeckoTerminalData, pool_address, timeframe, aggregate, limit }) => {
  const [response, setResponse] = useState<GeckoTerminalData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  //const [ohlcv,setOhlcv] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.geckoterminal.com/api/v2/networks/cro/pools/${pool_address}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}`;
      setLoading(true);
      setError(null);
      try {
        const fetchResponse = await fetch(url);
        const result: GeckoTerminalData = await fetchResponse.json();
        setResponse(result);
        const filter = result.data.attributes.ohlcv_list.map((dohlcv) => {
          return ({
            date: unixToDate(dohlcv[0]),
            o: formatTokenPrice((dohlcv[1])),
            h: formatTokenPrice((dohlcv[2])),
            l: formatTokenPrice((dohlcv[3])),
            c: formatTokenPrice((dohlcv[4])),
            v: (dohlcv[5]).toFixed(2)
          })
        });
        setGeckoTerminalData(filter)
      } catch (error) {
        setError('An error occurred while fetching the data:' + error);
      }
      setLoading(false);
    };

    fetchData();
  }, [aggregate, limit, pool_address, setGeckoTerminalData, timeframe]);
  return (
    <div id={id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
      {loading && <p className="text-blue-600 font-semibold">Loading...</p>}
      {error && <p className="text-red-600 font-semibold">Error: {error}</p>}
      {response && <p className="text-green-600 font-semibold">Number of data points: {response.data.attributes.ohlcv_list.length}</p>}
    </div>
  )
}

export default OHLCVData;