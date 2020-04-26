import StaticEntity from '../../game-engine/game-entities/StaticEntity';
import { customElement, html } from 'lit-element';
import Collider from '../../game-engine/game-object-types/Collider';

@customElement('world-structure')
export default class Structure extends StaticEntity {
    collider: Collider;

    protected firstUpdated(_changedProperties): void {
        super.firstUpdated(_changedProperties);
        this.setBoundingRect();
        this.getCollider();
    }

    setBoundingRect(): void {
        this.boundingRect = this.shadowRoot.querySelector('.bottom-part').getBoundingClientRect();
    }

    render() {
        return html`
            <style>
                :host {
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 0;

                    width: ${this.size.x}px;
                    height: ${this.size.y}px;
                    transform: translate(${this.position.x}px, ${this.position.y}px);
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
        let cameraPosition = window.Camera.getPosition();
        const relativeDomRect = new DOMRect(
            this.boundingRect.x + cameraPosition.x - 10,
            this.boundingRect.y + cameraPosition.y - 20,
            this.size.x,
            this.size.y,
        );
        this.collider = new Collider(relativeDomRect);
        return this.collider;
    }
}
