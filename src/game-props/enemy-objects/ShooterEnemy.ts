import Enemy from '../base/Enemy';
import { css, CSSResult, customElement, html, property, TemplateResult } from 'lit-element';
import './EnemyHealthBar';
import normalShadow from '../style-objects/NormalShadow';
import VectorMath from '../../game-engine/math/VectorMath';

@customElement('shooter-enemy')
export default class ShooterEnemy extends Enemy {
    @property({ type: Number })
    rotation: number;
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
        this.lookTowardsPlayer();
    }

    lookTowardsPlayer(): void {
        this.rotation = VectorMath.lookTowards(this.player.position, this.position);
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`;
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
