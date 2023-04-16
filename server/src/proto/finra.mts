import axios from "axios";
import xlsx from "xlsx";

interface MarginData {
  month: string;
  debitBalances: number;
}

const fetchMarginData = async (): Promise<MarginData[]> => {
  const marginData: MarginData[] = [];
  try {
    const response = await axios.get('https://www.finra.org/sites/default/files/2021-03/margin-statistics.xlsx', {
      responseType: 'arraybuffer'
    });
    const workbook = xlsx.read(response.data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = xlsx.utils.sheet_to_csv(sheet);
    const lines = csv.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split('"');
      const obj: MarginData = {} as MarginData;
      obj.month = currentLine[0].replace(/\,/g,'');
      obj.debitBalances = parseInt(currentLine[1].replace(/\,/g,''));
      marginData.push(obj);
    }

    console.log(marginData);
  } catch (error) {
    console.error(error);
  }

  return marginData;
};

export { fetchMarginData, MarginData };