import { Vector2 } from '../game-object-types/Vector2';

export default class VectorMath {
    static normalize(x: number, y: number, precision: number = 2): Vector2 {
        const max = Math.max(Math.abs(x), Math.abs(y));
        return new Vector2(
            Number.parseFloat((x / max).toFixed(precision)),
            Number.parseFloat((y / max).toFixed(precision)),
        );
    }

    static calculateHeading(source: Vector2, target: Vector2): Vector2 {
        return VectorMath.normalize(target.x - source.x, target.y - source.y);
    }

    static calculateNextPosition(currentPosition: Vector2, heading: Vector2, movementSpeed: number): Vector2 {
        return new Vector2(
            currentPosition.x + movementSpeed * heading.x,
            currentPosition.y + movementSpeed * heading.y,
        );
    }
}
