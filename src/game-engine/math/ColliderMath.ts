import Collider from '../game-object-types/Collider';
import StaticEntity from '../game-entities/StaticEntity';

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

    static isCollidingWithStaticEntity(source: Collider): boolean {
        let isColliding = false;
        for (const entity of window.GameManager.getStaticEntities()) {
            if (ColliderMath.isColliding(source, entity.getCollider())) {
                isColliding = true;
                break;
            }
        }
        return isColliding;
    }
}
