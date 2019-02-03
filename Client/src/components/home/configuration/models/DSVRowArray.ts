import { DSVRowString } from "d3-dsv";

export class DSVRowArray<Columns extends string = string> extends Array<DSVRowString<Columns>> {
    columns: Array<Columns>;

    constructor() {
        super();
        this.columns = new Array<Columns>();
    }
}
