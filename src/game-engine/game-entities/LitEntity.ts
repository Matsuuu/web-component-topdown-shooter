import { LitElement, property } from 'lit-element';
import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';
import { GameEntity } from '../interfaces/GameEntity';

export abstract class LitEntity extends LitElement implements GameEntity {
    enabled: boolean = true;
    abstract tick(): void;

    entityId: number;
    @property({ type: Vector2 })
    position: Vector2 = new Vector2(0, 0);
    @property({ type: Number })
    rotation: number = 0;

    constructor() {
        super();
        this.waitForGameWorldToInitialize();
    }

    waitForGameWorldToInitialize(): void {
        const wait: Function = () => {
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

    getCollider(): Promise<Collider> {
        const size: Vector2 = new Vector2(this.clientWidth, this.clientHeight);
        return window.CollisionCalculator.getCollider(this.position, size, this.rotation, this.entityId);
    }
}
