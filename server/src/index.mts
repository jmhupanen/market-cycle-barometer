import express from 'express';
import * as dotenv from 'dotenv';
import { fetchMarginData, MarginData } from './proto/finra.mjs';
import { fetchDrawdown } from './proto/drawdown.mjs';

const router = express();
const port = 3000;

router.get('/', (req, res) => {
  res.send('Hello world');
});

router.get('/margin', async (req, res) => {
  const marginData: MarginData[] = await fetchMarginData();
  res.send(marginData);
});

router.get('/drawdown', async (req, res) => {
  const drawdown: number = await fetchDrawdown();
  res.send(drawdown);
});

router.listen(port, () => {
  console.log(`Server is running on ${port}`);
});