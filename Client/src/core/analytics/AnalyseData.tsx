/**
 * Author: Caglar Özel
 */

// Packages
import * as d3_dsv from "d3-dsv";

// Models
import { DSVRowArray } from "../../components/home/configuration/models/DSVRowArray";

export class AnalyseData {
    constructor() {}

    public parseTsvToJson(content: string): DSVRowArray<string> {
        return d3_dsv.tsvParse(content);
    }

    public parseCsvToJson(content: string): DSVRowArray<string> {
        return d3_dsv.csvParse(content);
    }
}
