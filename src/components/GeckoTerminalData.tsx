// import { formatTokenPrice } from './formatTokenPrice';
// import { unixToMMDDYYYYHHMM } from './unixToDate';
// import { useGeckoTerminalData } from '@/hooks/useGeckoTerminalData';
// import OHLCVTable from './OHLCVTable';
export interface GeckoTerminalData {
  data: {
    id: string;
    type: string;
    attributes: {
      ohlcv_list: number[][];
    };
  };
  meta: {
    base: {
      address: string;
      name: string;
      symbol: string;
      coingecko_coin_id: string;
    };
    quote: {
      address: string;
      name: string;
      symbol: string;
      coingecko_coin_id: string;
    };
  };
}


export interface OhlcvData {
  date: string;
  o: string;
  h: string;
  l: string;
  c: string;
  v: string;
}