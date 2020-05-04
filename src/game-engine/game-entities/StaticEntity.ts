import { css, CSSResult, LitElement, property } from 'lit-element';
import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';
import { GameEntity } from '../interfaces/GameEntity';
import { PropertyValues } from 'lit-element/lib/updating-element';

/**
 * Static entities are the building blocks of the world.
 * Static entities have a collider, but have no tick events.
 *
 * Static entities are used for structures, walls, etc.
 */
export default abstract class StaticEntity extends LitElement implements GameEntity {
    enabled: boolean;
    entityId: number;
    collider: Collider;

    @property({ type: Vector2 })
    position: Vector2;
    @property({ type: Number })
    rotation: number = 0;
    @property({ type: Vector2 })
    size: Vector2;

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

    protected firstUpdated(_changedProperties: PropertyValues): void {
        setTimeout(() => {
            this.entityId = window.GameManager.addStaticEntity(this);
        });
    }

    getShadows(): CSSResult {
        return css`
            :host {
                box-shadow: 37.5px 13.5px 1px -11.5px #48484866;
            }
        `;
    }

    // Leave empty
    tick(): void {
        //
    }
}
