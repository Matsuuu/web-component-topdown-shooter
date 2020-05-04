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
        this.topLeft = this.getRelativeCoords(position, size, rotation);
        this.topRight = this.getRelativeCoords(new Vector2(position.x + size.x, position.y), size, rotation);
        this.bottomRight = this.getRelativeCoords(
            new Vector2(position.x + size.x, position.y + size.y),
            size,
            rotation,
        );
        this.bottomLeft = this.getRelativeCoords(new Vector2(position.x, position.y + size.y), size, rotation);
        this.width = size.x;
        this.height = size.y;
    }

    getCenter(position: Vector2, size: Vector2): void {
        this.center = new Vector2(position.x + size.x / 2, position.y + size.y / 2);
    }

    getRelativeCoords(position: Vector2, size: Vector2, rotation: number): Vector2 {
        /*if (rotation !== 0) {
            return this.getRotatedCorner(position, size, rotation);
        }*/
        return new Vector2(position.x, position.y);
    }

    getRotatedCorner(position: Vector2, size: Vector2, rotation: number): Vector2 {
        const tempX: number = position.x - this.center.x;
        const tempY: number = position.y + this.center.y;

        const rotatedX: number = tempX * Math.cos(rotation) + tempY * Math.sin(rotation);
        const rotatedY: number = tempX * Math.sin(rotation) - tempY * Math.cos(rotation);

        return new Vector2(rotatedX + this.center.x, rotatedY - this.center.y);
    }
}
