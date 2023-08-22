import express from 'express';
import * as dotenv from 'dotenv';
import { fetchMarginData, MarginData } from './proto/finra.mjs';
import { fetchDrawdown, HistoricalPrice } from './proto/drawdown.mjs';
import { fetchSmas } from './proto/sma.mjs';
import { fetchPcRatio } from './proto/putcall.mjs';

const router = express();
const port = 3000;

dotenv.config();

router.get('/', (req, res) => {
  res.send('Hello world');
});

router.get('/margin', async (req, res) => {
  const marginData: MarginData[] = await fetchMarginData();
  res.send(marginData);
});

router.get('/drawdown', async (req, res) => {
  const drawdown: HistoricalPrice[] = await fetchDrawdown();
  res.send(drawdown);
});

router.get('/sma', async (req, res) => {
  const smas = await fetchSmas();
  res.send(smas);
});

router.get('/putcall', async (req, res) => {
  const pcRatio = await fetchPcRatio();
  res.send({ putCallRatio: pcRatio });
});

router.listen(port, () => {
  console.log(`Server is running on ${port}`);
});