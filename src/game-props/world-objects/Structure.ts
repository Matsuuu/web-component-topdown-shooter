import StaticEntity from '../../game-engine/game-entities/StaticEntity';
import { customElement, html, property } from 'lit-element';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import Collider from '../../game-engine/game-object-types/Collider';

@customElement('world-structure')
export default class Structure extends StaticEntity {
    collider: Collider;

    protected firstUpdated(_changedProperties): void {
        this.collider = new Collider(this.querySelector('.bottom-part').getBoundingClientRect());
    }

    render() {
        return html`
            <style>
                :host {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;

                    width: ${this.size.x}px;
                    height: ${this.size.y}px;
                    transform: translate(${this.worldPosition.x}px, ${this.worldPosition.y}px);
                    border: 2px solid #000;
                }
                .top-part {
                    width: 100%;
                    height: ${this.size.y / 3}px;
                    border-bottom: 2px solid #000;
                    background: #fff;
                }
                .bottom-part {
                    width: 100%;
                    height: ${this.size.y - this.size.y / 3}px;
                    background: #c4c4c4;
                    border-bottom: 2px solid #000;
                    z-index: 999;
                }
                ${this.getShadows()}
            </style>
            <div class="top-part"></div>
            <div class="bottom-part"></div>
        `;
    }

    getCollider(): Collider {
        return this.collider;
    }
}
