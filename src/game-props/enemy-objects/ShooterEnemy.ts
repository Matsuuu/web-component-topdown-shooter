import Enemy from '../base/Enemy';
import { css, CSSResult, customElement, html, TemplateResult } from 'lit-element';
import './EnemyHealthBar';
import normalShadow from '../style-objects/NormalShadow';

@customElement('shooter-enemy')
export default class ShooterEnemy extends Enemy {
    static get styles(): Array<CSSResult> {
        return [
            normalShadow,
            css`
                :host {
                    position: absolute;
                    bottom: 0;
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

    init(): void {
        super.init();
        this.health = this.maxHealth = 30;
    }

    tick(): void {
        super.tick();
    }

    render(): TemplateResult {
        return html`
            <style>
                ${this.getDamageFlashStyles()}
                ${this.getPositionStyles()}
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
