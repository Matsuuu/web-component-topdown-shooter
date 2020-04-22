import { Vector2 } from './Vector2';

export default class CollisionEvent {
    source: GameEntity;
    target: GameEntity;
    collisionDirection: Vector2;

    constructor(source: GameEntity, target: GameEntity, collisionDirection: Vector2 = null) {
        this.target = target;
        this.source = source;
        this.collisionDirection = collisionDirection;
    }
}
