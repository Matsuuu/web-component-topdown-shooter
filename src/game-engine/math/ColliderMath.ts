import Collider from '../game-object-types/Collider';
import StaticEntity from '../game-entities/StaticEntity';
import CollisionEvent from '../game-object-types/CollisionEvent';
import { Vector2 } from '../game-object-types/Vector2';
import { LitEntity } from '../game-entities/LitEntity';

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

    static getCollision(source: LitEntity, target: LitEntity): CollisionEvent {
        const sourceCollider = source.getCollider();
        const targetCollider = target.getCollider();

        if (ColliderMath.isColliding(sourceCollider, targetCollider)) {
            const higherX = Math.max(sourceCollider.center.x, targetCollider.center.x);
            const higherY = Math.max(sourceCollider.center.y, targetCollider.center.y);
            let collisionDirection = new Vector2(0, 0);
            collisionDirection.y = higherY === sourceCollider.center.y ? -1 : 1;
            collisionDirection.x = higherX === sourceCollider.center.x ? -1 : 1;
            return new CollisionEvent(source, target, collisionDirection);
        }
        return null;
    }

    /**
     * TODO
     * @param source
     * @param target
     */
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
