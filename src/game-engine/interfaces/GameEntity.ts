import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';

export interface GameEntity {
    entityId: number;
    enabled: boolean;
    position: Vector2;
    rotation: number;

    tick(): void;
    getCollider(): Promise<Collider>;
}
