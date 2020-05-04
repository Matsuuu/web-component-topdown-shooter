import { getWindowSize } from '../apis/boundaries/Boundaries';
import { Vector2 } from '../game-object-types/Vector2';
import Collider from '../game-object-types/Collider';

export default class BoundaryMath {
    /**
     * Check if the object (target) is inside the window.
     *
     * @param target Target of checking
     * @param padding How much extra leeway we wan't to give. For example for culling
     * we might want to enable the object a bit before they come into screen
     */
    static isInsideWindow(target: Collider, padding: number = 0): boolean {
        const windowSize: Vector2 = getWindowSize();
        return true;
        return (
            0 - padding < target.center.x === target.center.x < windowSize.x + padding &&
            0 - padding < target.center.y === target.center.y < windowSize.y + padding
        );
    }
}
