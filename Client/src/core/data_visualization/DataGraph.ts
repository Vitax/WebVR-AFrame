/**
 * Author: Caglar Özel
 */

// Models
import { GraphConfiguration } from "../../components/home/configuration/models/GraphConfig";
import { DSVRowArray } from "../../components/home/configuration/models/DSVRowArray";

// Represents a Branch in Graph
export class Branch {
    Name: string;
    Information: Array<string>;

    constructor(name: string, information: Array<string>) {
        this.Name = name;
        this.Information = information;
    }
}

export class DataGraph {
    private Roots: { [key: string]: Array<Branch> };

    constructor() {
        this.Roots = {};
    }

    private createRoot(root: string) {
        if (this.Roots[root] == null) this.Roots[root] = new Array<Branch>();
    }

    private createBranch(name: string, information: Array<string>) {
        return new Branch(name, information);
    }

    private addBranch(root: string, branch: Branch) {
        if (!this.Roots[root].includes(branch)) this.Roots[root].push(branch);
    }

    public generateWorldDate(
        dataset: DSVRowArray<string>,
        graphConfiguration: GraphConfiguration
    ): { [key: string]: Array<Branch> } {
        let graph = new DataGraph();

        dataset.forEach(entry => {
            graph.createRoot(entry[graphConfiguration.MainAttribute]);

            let branchInformation = new Array<string>();
            for (let i = 0; i < graphConfiguration.VisualInformation.length; ++i) {
                branchInformation.push(entry[graphConfiguration.VisualInformation[i]]);
            }

            let branch = graph.createBranch(entry[graphConfiguration.SecondaryAttribute], branchInformation);
            graph.addBranch(entry[graphConfiguration.MainAttribute], branch);
        });

        return graph.Roots;
    }
}
