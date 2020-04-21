import { css, LitElement, property } from 'lit-element';
import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';

/**
 * Static entities are the building blocks of the world.
 * Static entities have a collider, but have no tick events.
 *
 * Static entities are used for structures, walls, etc.
 */
export default abstract class StaticEntity extends LitElement {
    @property({ type: Vector2 })
    worldPosition: Vector2;
    @property({ type: Vector2 })
    size: Vector2;

    abstract getCollider(): Collider;

    protected firstUpdated(_changedProperties): void {
        setTimeout(() => {
            console.log(this);
            window.GameManager.addStaticEntity(this);
        });
    }

    getShadows() {
        return css`
            :host {
                box-shadow: 37.5px 13.5px 1px -11.5px #48484866;
            }
        `;
    }
}
