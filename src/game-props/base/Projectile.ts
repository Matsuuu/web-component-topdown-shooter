import { property } from 'lit-element';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';

export default class Projectile extends LitEntity {
    @property({ type: Number })
    x: number;
    @property({ type: Number })
    y: number;
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Vector2 })
    heading: Vector2;

    firstUpdated() {
        super.firstUpdated();
        this.style.left = `${this.x}px`;
        this.style.top = `${this.y}px`;
    }
}
