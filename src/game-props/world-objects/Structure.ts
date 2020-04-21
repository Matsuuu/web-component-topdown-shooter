import StaticEntity from '../../game-engine/game-entities/StaticEntity';
import { customElement, html, property } from 'lit-element';
import Collider from '../../game-engine/game-object-types/Collider';

@customElement('world-structure')
export default class Structure extends StaticEntity {
    collider: Collider;

    protected firstUpdated(_changedProperties): void {
        super.firstUpdated(_changedProperties);
        this.collider = new Collider(this.shadowRoot.querySelector('.bottom-part').getBoundingClientRect());
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
                    background-color: #f5edef;
                    background-image: url("https://www.transparenttextures.com/patterns/dark-denim.png");
                }
                .bottom-part {
                    width: 100%;
                    height: ${this.size.y - this.size.y / 3}px;
                    background-color: #f5edef;
                    background-image: url("https://www.transparenttextures.com/patterns/crissxcross.png");
                    /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
                    border-bottom: 2px solid #000;
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
