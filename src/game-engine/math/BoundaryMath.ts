import { Boundary } from '../Boundaries';
import { Vector2 } from '../game-object-types/Vector2';

export default class BoundaryMath {
    static isOutsideBoundary(target: Vector2, boundaryX: Boundary, boundaryY: Boundary): boolean {
        return (
            target.x < boundaryX.min || target.x > boundaryX.max || target.y < boundaryY.min || target.y > boundaryY.max
        );
    }
}
