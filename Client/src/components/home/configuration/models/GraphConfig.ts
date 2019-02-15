/**
 * Author: Caglar Özel
 */


export class GraphConfiguration {
    public MainAttribute: string;
    public SecondaryAttribute: string;
    public VisualInformation: Array<string>;

    constructor() {
        this.MainAttribute = "";
        this.SecondaryAttribute = "";
        this.VisualInformation = new Array<string>();
    }
}
