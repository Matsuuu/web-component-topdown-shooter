import Collider from '../game-object-types/Collider';

export default class ColliderMath {
    static isColliding(source: Collider, target: Collider, circleCollision: boolean = false): boolean {
        if (circleCollision) {
            return ColliderMath.isCircleColliding(source, target);
        }
        return (
            source.left < target.right &&
            source.right > target.left &&
            source.top < target.bottom &&
            source.bottom > target.top
        );
    }

    static isCircleColliding(source: Collider, target: Collider): boolean {
        return true;
    }
}
