import { Vector2 } from './Vector2';

export default class Collider {
    topLeft: Vector2;
    topRight: Vector2;
    bottomRight: Vector2;
    bottomLeft: Vector2;
    width: number;
    height: number;
    center: Vector2;

    constructor(position: Vector2, size: Vector2, rotation: number) {
        this.getCenter(position, size);
        this.width = size.x;
        this.height = size.y;
        this.topLeft = this.getRelativeCoords(position, size, rotation);
        this.topRight = this.getRelativeCoords(new Vector2(position.x + size.x, position.y), size, rotation);
        this.bottomRight = this.getRelativeCoords(
            new Vector2(position.x + size.x, position.y + size.y),
            size,
            rotation,
        );
        this.bottomLeft = this.getRelativeCoords(new Vector2(position.x, position.y + size.y), size, rotation);
    }

    getCenter(position: Vector2, size: Vector2): void {
        this.center = new Vector2(position.x + size.x / 2, position.y - size.y / 2);
    }

    getRelativeCoords(position: Vector2, size: Vector2, rotation: number): Vector2 {
        const relativePos: Vector2 = new Vector2(position.x, position.y - size.y);
        if (rotation !== 0) {
            return this.getRotatedCorner(relativePos, size, rotation);
        }
        return relativePos;
    }

    getRotatedCorner(position: Vector2, size: Vector2, rotation: number): Vector2 {
        const angle: number = (rotation * Math.PI) / 180;

        const rotatedX: number =
            Math.cos(angle) * (position.x - this.center.x) -
            Math.sin(angle) * (position.y - this.center.y) +
            this.center.x;
        const rotatedY: number =
            Math.sin(angle) * (position.x - this.center.x) +
            Math.cos(angle) * (position.y - this.center.y) +
            this.center.y;

        return new Vector2(rotatedX, rotatedY);
    }
}
