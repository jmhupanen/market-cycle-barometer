import axios from "axios";

const fetchPcRatio = async (): Promise<number> => {
  let pcRatio = 0;

  try {
    const currentDate = new Date().toJSON().slice(0, 10);
    const headers = { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0'
    }
    const response = await axios.get(`https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${currentDate}`, { 
      headers: headers 
    });

    pcRatio = Number(response.data.put_call_options.data[0].y.toFixed(2));
  } catch (err) {
    console.log(err);
  }

  return pcRatio;
};

export { fetchPcRatio };