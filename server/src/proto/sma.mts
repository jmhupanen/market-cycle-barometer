import axios from "axios";

const fetchSmas = async (): Promise<any> => {
  try {
    const responses = await Promise.all([
      axios.get(`https://financialmodelingprep.com/api/v3/technical_indicator/daily/SPY?period=1000&type=sma&apikey=${process.env.FMP_API_KEY}`),
      axios.get(`https://financialmodelingprep.com/api/v3/technical_indicator/daily/SPY?period=500&type=sma&apikey=${process.env.FMP_API_KEY}`),
      axios.get(`https://financialmodelingprep.com/api/v3/technical_indicator/daily/SPY?period=250&type=sma&apikey=${process.env.FMP_API_KEY}`)
    ]);
    
    const sma200Data = responses[0].data;
    const sma100Data = responses[1].data;
    const sma50Data = responses[2].data;

    const isUnder200Week = sma200Data[0].close < sma200Data[0].sma;
    const isUnder100Week = sma100Data[0].close < sma100Data[0].sma;
    const isUnder50Week = sma50Data[0].close < sma50Data[0].sma;

    const is200WeekDecreasing = sma200Data[0].sma < sma200Data[1].sma;

    console.log(`SP500 is ${isUnder200Week ? 'under' : 'over'} 200 week MA, ${isUnder100Week ? 'under' : 'over'} 100 week MA, and ${isUnder50Week ? 'under' : 'over'} 50 week MA`);

    console.log(`200 week MA is ${is200WeekDecreasing ? 'dipping' : 'going to the moon'}`);

    return sma200Data;
  } catch (err) {
    console.log(err);
  }
};

export { fetchSmas };