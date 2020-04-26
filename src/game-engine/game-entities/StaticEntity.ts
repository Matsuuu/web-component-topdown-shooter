import { css, LitElement, property } from 'lit-element';
import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';
import { GameEntity } from '../interfaces/GameEntity';

/**
 * Static entities are the building blocks of the world.
 * Static entities have a collider, but have no tick events.
 *
 * Static entities are used for structures, walls, etc.
 */
export default abstract class StaticEntity extends LitElement implements GameEntity {
    enabled: boolean;
    entityId: number;

    @property({ type: Vector2 })
    position: Vector2;
    @property({ type: Vector2 })
    size: Vector2;
    @property({ type: DOMRect })
    boundingRect: DOMRect;

    abstract getCollider(): Collider;

    abstract setBoundingRect(): void;

    protected firstUpdated(_changedProperties): void {
        setTimeout(() => {
            this.entityId = window.GameManager.addStaticEntity(this);
        });
    }

    getShadows() {
        return css`
            :host {
                box-shadow: 37.5px 13.5px 1px -11.5px #48484866;
            }
        `;
    }

    // Leave empty
    tick(): void {}
}
