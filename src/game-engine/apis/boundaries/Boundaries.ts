import { Vector2 } from '../../game-object-types/Vector2';

export interface Boundary {
    min: number;
    max: number;
}

class Boundaries {
    static _instance: Boundaries;

    windowSize: Vector2;

    xBoundary: Boundary;

    yBoundary: Boundary;

    constructor() {
        this.windowSize = new Vector2(window.innerWidth, window.innerHeight);
        this.xBoundary = { min: 0, max: window.innerWidth } as Boundary;
        this.yBoundary = { min: 0, max: window.innerHeight } as Boundary;
        Boundaries._instance = this;
    }

    getRelativeXBoundary(): Boundary {
        const offsetX: number = window.Camera.getPosition().x;
        return {
            min: this.xBoundary.min - offsetX,
            max: this.xBoundary.max - offsetX,
        } as Boundary;
    }

    getRelativeYBoundary(): Boundary {
        const offsetY: number = window.Camera.getPosition().y;
        return {
            min: (this.yBoundary.min + offsetY) * -1,
            max: (this.yBoundary.max + offsetY) * -1,
        } as Boundary;
    }
}

export const getXBoundary: Function = (): Boundary => Boundaries._instance.getRelativeXBoundary();
export const getYBoundary: Function = (): Boundary => Boundaries._instance.getRelativeYBoundary();
export const getWindowSize: Function = (): Vector2 => Boundaries._instance.windowSize;
export const InitBoundaries: Function = (): Boundaries => new Boundaries();
