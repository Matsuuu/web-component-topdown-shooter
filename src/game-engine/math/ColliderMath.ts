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

    /**
     * Check if object collides with something static in the game world e.g. a wall.
     * optional param staticEntityColliders is to that workers can utilize this script,
     * since they can't query GameManager for the static entities
     *
     * @param source
     * @param staticEntityColliders
     */
    static isCollidingWithStaticEntity(source: Collider, staticEntityColliders?: Array<Collider>): boolean {
        let isColliding = false;
        if (!staticEntityColliders) {
            staticEntityColliders = window.GameManager.getStaticEntities().map(entity => entity.getCollider());
        }
        for (const entityCollider of staticEntityColliders) {
            if (ColliderMath.isColliding(source, entityCollider)) {
                isColliding = true;
                break;
            }
        }
        return isColliding;
    }
}
