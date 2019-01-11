import axios from "axios";

export class DatasetService {
  constructor() {}

  /** Gets the Dataset either from local storage or web */
  public getDataset(url: string): Promise<any> {
    return axios.get(url);
  }
}
