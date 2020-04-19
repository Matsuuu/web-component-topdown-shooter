import { LitElement } from 'lit-element';
import Collider from '../game-object-types/Collider';

export class LitEntity extends LitElement implements GameEntity {
    entityId: number;

    tick(): void {}

    addEntity(): void {
        this.entityId = window.GameManager.addGameEntity(this);
    }

    removeEntity(): void {
        window.GameManager.removeGameEntity(this.entityId);
    }

    protected firstUpdated(): void {
        this.addEntity();
    }

    getCollider(): Collider {
        return new Collider(this.getBoundingClientRect());
    }
}
