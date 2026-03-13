import axios from "axios";

const calcSma = (prices: number[], period: number) =>
  prices.slice(0, period).reduce((sum, p) => sum + p, 0) / period;

const fetchSmas = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=SPY&apikey=${process.env.FMP_API_KEY}`
    );

    const prices: { date: string; close: number }[] = response.data;
    const closes = prices.map(p => p.close);
    const latestClose = closes[0];

    const sma1000 = calcSma(closes, 1000); // 200-week
    const sma500  = calcSma(closes, 500);  // 100-week
    const sma250  = calcSma(closes, 250);  // 50-week

    const prevSma1000 = calcSma(closes.slice(1), 1000);

    const isUnder200Week = latestClose < sma1000;
    const isUnder100Week = latestClose < sma500;
    const isUnder50Week  = latestClose < sma250;
    const is200WeekDecreasing = sma1000 < prevSma1000;

    console.log(`SP500 is ${isUnder200Week ? 'under' : 'over'} 200 week MA, ${isUnder100Week ? 'under' : 'over'} 100 week MA, and ${isUnder50Week ? 'under' : 'over'} 50 week MA`);
    console.log(`200 week MA is ${is200WeekDecreasing ? 'dipping' : 'going to the moon'}`);

    return { latestClose, sma1000, sma500, sma250, isUnder200Week, isUnder100Week, isUnder50Week, is200WeekDecreasing };
  } catch (err) {
    console.log(err);
  }
};

export { fetchSmas };
