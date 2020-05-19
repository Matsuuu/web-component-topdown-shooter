import { LitElement, property } from 'lit-element';
import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';
import { GameEntity } from '../interfaces/GameEntity';

export abstract class LitEntity extends LitElement implements GameEntity {
    enabled: boolean = true;

    entityId: number;
    @property({ type: Vector2 })
    position: Vector2 = new Vector2(0, 0);
    lastPosition: Vector2 = new Vector2(0, 0);
    @property({ type: Number })
    rotation: number = 0;

    collider: Collider;

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

    tick(): void {
        if (!this.position.equals(this.lastPosition)) {
            // Only reset collider if movement has been done
            this.resetCollider();
        }
        this.lastPosition = this.position.copy();
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

    /**
     * Save collider to variable for cases where the same collider is queried multiple times
     * in a single game tick.
     */
    async getCollider(): Promise<Collider> {
        if (!this.collider) {
            const size: Vector2 = new Vector2(this.clientWidth, this.clientHeight);
            this.collider = await window.CollisionCalculator.getCollider(
                this.position,
                size,
                this.rotation,
                this.entityId,
            );
        }
        return this.collider;
    }

    /**
     * Nulls the collider, so it will be re-calculated next game tick.
     * */
    resetCollider(): void {
        this.collider = null;
    }
}
