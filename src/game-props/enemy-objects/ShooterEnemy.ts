import Enemy from '../base/Enemy';
import { css, customElement, html } from 'lit-element';
import './EnemyHealthBar';
import normalShadow from '../style-objects/NormalShadow';

@customElement('shooter-enemy')
export default class ShooterEnemy extends Enemy {
    static get styles() {
        return [
            normalShadow,
            css`
                :host {
                    position: absolute;
                    top: 0;
                    left: 0;

                    display: block;
                    width: 25px;
                    height: 25px;
                    background: red;
                    border-radius: 5px;

                    will-change: transform;
                }
            `,
        ];
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.health = this.maxHealth = 30;
    }

    protected firstUpdated(): void {
        super.firstUpdated();
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }

    tick() {
        super.tick();
    }

    render() {
        return html`
            <style>
                ${this.getDamageFlashStyles()}
            </style>
            <enemy-health-bar
                width="${55}"
                parentWidth="${25}"
                maxFill="${this.maxHealth}"
                currentFill=${this.health}
            ></enemy-health-bar>
        `;
    }
}
