import { LitElement } from 'lit-element';
import Collider from '../game-object-types/Collider';

export abstract class LitEntity extends LitElement implements GameEntity {
    entityId: number;

    tick(): void {}

    constructor() {
        super();
        this.waitForGameWorldToInitialize();
    }

    waitForGameWorldToInitialize() {
        const wait = () => {
            if (!window.GameManager) return setTimeout(() => wait(), 50);
            this.init();
        };
        wait();
    }

    init(): void {
        this.addEntity();
    }

    addEntity(): void {
        this.entityId = window.GameManager.addGameEntity(this);
    }

    removeEntity(): void {
        window.GameManager.removeGameEntity(this.entityId);
    }

    getCollider(): Collider {
        return new Collider(this.getBoundingClientRect());
    }
}
