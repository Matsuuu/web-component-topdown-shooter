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

    getShadows() {
        return css`
            :host {
                box-shadow: ${this.size.x * 0.75}px ${this.size.x * 0.25 + 1}px 1px ${this.size.x * 0.25 * -1}px #484848;
            }
        `;
    }
}
