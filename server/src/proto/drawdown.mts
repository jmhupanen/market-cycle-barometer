import axios from "axios";

interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  unadjustedVolume: number;
  change: number;
  changePercent: number;
  vwap: number;
  label: string;
  changeOverTime: number;
}

const fetchDrawdown = async (): Promise<HistoricalPrice[]> => { 
  // Five years of price history
  const response = await axios.get(
    `https://financialmodelingprep.com/api/v3/historical-price-full/SPY?apikey=${process.env.FMP_API_KEY}`
  );

  const sp500Data: HistoricalPrice[] = response.data["historical"];
  const athPrice = sp500Data.reduce((prev: HistoricalPrice, curr:  HistoricalPrice) => prev.high > curr.high ? prev : curr).high;
  const latestPrice = sp500Data[0].close;

  const drawdown = (((athPrice - latestPrice) / athPrice) * 100).toFixed(2);

  console.log(`The current drawdown for SP500 is ${drawdown}%`);

  return sp500Data;
};

export { fetchDrawdown, HistoricalPrice };