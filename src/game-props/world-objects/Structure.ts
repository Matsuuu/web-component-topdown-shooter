import StaticEntity from '../../game-engine/game-entities/StaticEntity';
import { customElement, html, TemplateResult } from 'lit-element';
import Collider from '../../game-engine/game-object-types/Collider';
import { PropertyValues } from 'lit-element/lib/updating-element';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';

@customElement('world-structure')
export default class Structure extends StaticEntity {
    collider: Collider;
    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        this.getCollider();
        this.addEventListener('click', () => {
            console.log(new Vector2(this.offsetWidth, this.offsetHeight));
            this.getCollider().then(collider => console.log(collider));
        });
    }

    render(): TemplateResult {
        return html`
            <style>
                :host {
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 0;

                    width: ${this.size.x}px;
                    height: ${this.size.y}px;
                    transform: translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg);
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

    async getCollider(): Promise<Collider> {
        if (!this.collider) {
            this.collider = new Collider(
                this.position,
                new Vector2(this.offsetWidth, this.offsetHeight),
                this.rotation,
            );
        }
        return this.collider;
    }
}
