import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';

export interface GameEntity {
    entityId: number;
    enabled: boolean;
    position: Vector2;
    tick(): void;
    getCollider(): Collider;
}
