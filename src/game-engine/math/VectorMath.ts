import { Vector2 } from '../game-object-types/Vector2';
import { Boundary, getXBoundary, getYBoundary } from '../Boundaries';

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

    static ticksUntilCrossesXAxis(position: Vector2, heading: Vector2, movementSpeed: number, boundary: Boundary) {
        return VectorMath.ticksUntilCrossesAxis(position.x, heading.x, movementSpeed, boundary);
    }

    static ticksUntilCrossesYAxis(position: Vector2, heading: Vector2, movementSpeed: number, boundary: Boundary) {
        return VectorMath.ticksUntilCrossesAxis(position.y, heading.y, movementSpeed, boundary);
    }

    static ticksUntilCrossesAxis(position: number, heading: number, movementSpeed: number, boundary: Boundary) {
        if (heading < 0) {
            return Math.ceil((position - boundary.min) / movementSpeed / Math.abs(heading)) + 1;
        }
        return Math.ceil((boundary.max - position) / movementSpeed / heading) + 1;
    }

    /**
     * Determine the count of game ticks until this object crosses the play area border
     */
    static ticksUntilCrossesBorder(
        position: Vector2,
        heading: Vector2,
        movementSpeed: number,
        xBoundary: Boundary,
        yBoundary: Boundary,
    ): number {
        let xCrossTicks = VectorMath.ticksUntilCrossesXAxis(position, heading, movementSpeed, xBoundary);
        let yCrossTicks = VectorMath.ticksUntilCrossesYAxis(position, heading, movementSpeed, yBoundary);

        return Math.min(xCrossTicks, yCrossTicks);
    }

    static determineCrossPoint(
        calculatedTickCount: number,
        position: Vector2,
        heading: Vector2,
        movementSpeed: number,
    ): Vector2 {
        let crossCoords = { x: null, y: null };
        if (heading.y < 0) {
            crossCoords.y = position.y - calculatedTickCount * movementSpeed * Math.abs(heading.y);
        } else {
            crossCoords.y = position.y + calculatedTickCount * movementSpeed * heading.y;
        }

        if (heading.x < 0) {
            crossCoords.x = position.x - calculatedTickCount * movementSpeed * Math.abs(heading.x);
        } else {
            crossCoords.x = position.x + calculatedTickCount * movementSpeed * heading.x;
        }

        return crossCoords;
    }
}
