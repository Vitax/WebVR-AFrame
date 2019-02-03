// Models
import { GraphConfiguration } from "../../components/home/configuration/models/GraphConfig";
import { DSVRowArray } from "../../components/home/configuration/models/DSVRowArray";

export class AnalyseData {
    private configuration: GraphConfiguration;

    constructor(configuration: GraphConfiguration) {
        this.configuration = configuration;
    }

    private getRoot(root: string) {}

    private getBranch(branch: string) {}

    public getWorldGraph(dataSet: DSVRowArray<string>) {
        dataSet.map(node => {

        })
    }
}
