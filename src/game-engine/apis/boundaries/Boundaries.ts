export interface Boundary {
    min: number;
    max: number;
}

class Boundaries {
    static _instance: Boundaries;

    xBoundary: Boundary;

    yBoundary: Boundary;

    constructor() {
        this.xBoundary = { min: 0, max: window.innerWidth } as Boundary;
        this.yBoundary = { min: 0, max: window.innerHeight } as Boundary;
        Boundaries._instance = this;
    }
}

export const getXBoundary = (): Boundary => Boundaries._instance.xBoundary;
export const getYBoundary = (): Boundary => Boundaries._instance.yBoundary;
export const InitBoundaries = (): Boundaries => new Boundaries();
