import axios from "axios";

export class DatasetService {
  constructor() {}

  /** Gets the Dataset either from local storage or web */
  public getDataset(url: string) {
    let headers: Headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    axios.get(url, { headers: headers })
        .then(result => {
            console.log('result: ', result);
        });
  }
}
