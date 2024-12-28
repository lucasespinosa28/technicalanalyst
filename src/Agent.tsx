import React, { useState } from 'react';
import { useGeckoTerminalData } from './hooks/useGeckoTerminalData';
import OHLCVDisplay from './components/OHLCVDisplay';
import { unixToMMDDYYYYHHMM } from './components/unixToDate';
import GeckoTerminalForm from './components/GeckoTerminalForm';
import { formatTokenPrice } from './components/formatTokenPrice';
import { Button } from './components/ui/button';

interface FormData {
  pool_address: string;
  timeframe: string;
  aggregate: number;
  limit: number;
}

const OHLCVData: React.FC<FormData> = ({ pool_address, timeframe, aggregate, limit }) => {
  const { response, loading, error } = useGeckoTerminalData(
    pool_address,
    timeframe,
    aggregate,
    limit,
  );
  console.log(response)
  return (
    <div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {response && <>
        <OHLCVDisplay
          data={response.data.data.attributes.ohlcv_list.map(([timestamp, open, high, low, close, volume]: [number, string, string, string, string, string]) => ({
            date: unixToMMDDYYYYHHMM(timestamp),
            o: formatTokenPrice(parseFloat(open)),
            h: formatTokenPrice(parseFloat(high)),
            l: formatTokenPrice(parseFloat(low)),
            c: formatTokenPrice(parseFloat(close)),
            v: parseFloat(volume).toFixed(2)
          }))}
        />
      </>}
    </div>
  )

}

function App() {
  const [formData, setFormData] = useState<FormData | null>();

  const handleFormSubmit = (newFormData: FormData) => {
    setFormData(newFormData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Crypto.com AI Agent Technical Analysis
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        This application leverages Crypto.com's AI agent to perform technical analysis on cryptocurrency trading data. 
        It uses OHLCV (Open, High, Low, Close, Volume) data from various trading pairs to provide insights and analysis. 
        Simply input the pool address and timeframe parameters to get started with your analysis.
      </p>
      <GeckoTerminalForm onSubmit={handleFormSubmit} />
      {formData && <><OHLCVData pool_address={formData.pool_address} timeframe={formData.timeframe} aggregate={formData.aggregate} limit={formData.limit} /></>}
    </div>
  );
}

export default App;
