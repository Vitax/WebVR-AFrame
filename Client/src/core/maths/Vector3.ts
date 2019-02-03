export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    public toString() {
        return this.x.toString() + "  " + this.y.toString() + " " + this.z.toString();
    }
}
