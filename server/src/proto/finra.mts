import axios from "axios";
import xlsx from "xlsx";

interface MarginData {
  month: string;
  debitBalances: number;
  yoy: number;
  signalStatus: string | null;
}

const fetchMarginData = async (): Promise<MarginData[]> => {
  const marginData: MarginData[] = [];
  try {
    // Monthly margin account debit balances since 1997-01
    const response = await axios.get('https://www.finra.org/sites/default/files/2021-03/margin-statistics.xlsx', {
      responseType: 'arraybuffer'
    });
    const workbook = xlsx.read(response.data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = xlsx.utils.sheet_to_csv(sheet);
    const lines = csv.split('\n');

    processData(lines, marginData);
  } catch (error) {
    console.error(error);
  }

  return marginData;
};

const processData = (lines: string[], marginData: MarginData[]) => {
  let signalStatus = null;

  // Iterate through the lines starting from the bottom and add each element to the beginning of marginData array
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[lines.length-i].split('"');
    const obj: MarginData = {} as MarginData;
    obj.month = currentLine[0].replace(/\,/g,'');
    obj.debitBalances = parseInt(currentLine[1].replace(/\,/g,''));
    if (i > 12) {
      const debitYearAgo = marginData[11].debitBalances;
      obj.yoy = Number(((obj.debitBalances - debitYearAgo) / debitYearAgo).toFixed(4));
    }

    // Determine current signal based on following rules:
    // - Buy: on second negative month, until at least 30%
    // - Sell: if at least 40% and then the next month at least 45%, until single digit
    if (signalStatus == null) {
      if (obj.yoy < 0 && marginData[0].yoy < 0) signalStatus = 'buy';
      else if (obj.yoy >= 0.44 && marginData[0].yoy >= 0.4) signalStatus = 'sell';
    } 
    else if (signalStatus === 'buy' && obj.yoy > 0.3 || 
            signalStatus === 'sell' && obj.yoy < 0.1) signalStatus = null;
    obj.signalStatus = signalStatus;

    marginData.unshift(obj);
  }
};

export { fetchMarginData, MarginData };