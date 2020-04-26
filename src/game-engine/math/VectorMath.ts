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

    static determineCrossPoint(lifeTime: number, position: Vector2, heading: Vector2, movementSpeed: number): Vector2 {
        let crossCoords = { x: null, y: null };
        if (heading.y < 0) {
            crossCoords.y = position.y - lifeTime * movementSpeed * Math.abs(heading.y);
        } else {
            crossCoords.y = position.y + lifeTime * movementSpeed * heading.y;
        }

        if (heading.x < 0) {
            crossCoords.x = position.x - lifeTime * movementSpeed * Math.abs(heading.x);
        } else {
            crossCoords.x = position.x + lifeTime * movementSpeed * heading.x;
        }

        return crossCoords as Vector2;
    }

    /**
     * Willian Mariager at Stack overflow. You da real mvp.
     * https://gamedev.stackexchange.com/questions/19550/set-sprite-to-face-direction-of-mouse
     *
     * @param target
     * @param position
     */
    static lookTowards(target: Vector2, position: Vector2): number {
        return Math.floor((Math.atan2(target.y - position.y, target.x - position.x) * 180) / Math.PI + 90);
    }
}
