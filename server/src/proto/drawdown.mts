import axios from "axios";

const fetchDrawdown = async (): Promise<number> => { 
  const response = await axios.get(
    `https://api.finage.co.uk/last/index/SPX?apikey=${process.env.FINAGE_API_KEY}`
  );

  const sp500Data = response.data[0];
  const latestPrice = sp500Data.price;
  const allTimeHighPrice = sp500Data.allTimeHigh;

  const drawdown = ((allTimeHighPrice - latestPrice) / allTimeHighPrice) * 100;

  console.log(`Latest price for SP500: ${latestPrice}`);
  console.log(`All-time high price for SP500: ${allTimeHighPrice}`);
  console.log(`Drawdown from ATH: ${drawdown}%`);

  return drawdown;
};

export { fetchDrawdown };