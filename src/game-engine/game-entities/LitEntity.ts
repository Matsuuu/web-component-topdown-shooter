import { LitElement } from 'lit-element';

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
}
