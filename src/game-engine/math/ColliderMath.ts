import Collider from '../game-object-types/Collider';
import CollisionEvent from '../game-object-types/CollisionEvent';
import { Vector2 } from '../game-object-types/Vector2';
import { LitEntity } from '../game-entities/LitEntity';

export default class ColliderMath {
    static isColliding(source: Collider, target: Collider, circleCollision: boolean = false): boolean {
        if (!source || !target) {
            return false;
        }
        const col1x: number = source.topLeft.x - target.bottomRight.x;
        const col1y: number = source.topLeft.y - target.bottomRight.y;
        const col2x: number = target.topLeft.x - source.bottomRight.x;
        const col2y: number = target.topLeft.y - source.bottomRight.y;
        if (col1x > 0 || col1y > 0) {
            return false;
        }
        if (col2x > 0 || col2y > 0) {
            return false;
        }
        return true;
    }

    static async getCollision(source: LitEntity, target: LitEntity): Promise<CollisionEvent> {
        const sourceCollider: Collider = await source.getCollider();
        const targetCollider: Collider = await target.getCollider();

        console.log(sourceCollider);
        if (ColliderMath.isColliding(sourceCollider, targetCollider)) {
            const higherX: number = Math.max(sourceCollider.center.x, targetCollider.center.x);
            const higherY: number = Math.max(sourceCollider.center.y, targetCollider.center.y);
            const collisionDirection: Vector2 = new Vector2(0, 0);
            collisionDirection.y = higherY === sourceCollider.center.y ? -1 : 1;
            collisionDirection.x = higherX === sourceCollider.center.x ? -1 : 1;
            return new CollisionEvent(source, target, collisionDirection);
        }
        return null;
    }

    /**
     * Check if object collides with something static in the game world e.g. a wall.
     * optional param staticEntityColliders is to that workers can utilize this script,
     * since they can't query GameManager for the static entities
     *
     * @param source
     * @param staticEntityColliders
     */
    static async isCollidingWithStaticEntity(
        source: Collider,
        staticEntityColliders?: Array<Promise<Collider>>,
    ): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        let isColliding: boolean = false;
        if (!staticEntityColliders) {
            staticEntityColliders = window.GameManager.getStaticEntityColliders();
        }
        for (const entityCollider of staticEntityColliders) {
            if (ColliderMath.isColliding(source, await entityCollider)) {
                isColliding = true;
                break;
            }
        }
        return isColliding;
    }

    static calculateNextColliderPosition(
        currentPosition: Vector2,
        heading: Vector2,
        movementSpeed: number,
        size: Vector2,
        rotation: number,
        lifetimeElapsed: number,
    ): Collider {
        const positionX: number = currentPosition.x + lifetimeElapsed * heading.x * movementSpeed;
        const positionY: number = currentPosition.y + lifetimeElapsed * heading.y * movementSpeed;
        const position: Vector2 = new Vector2(positionX, positionY);
        return new Collider(position, size, rotation);
    }
}
