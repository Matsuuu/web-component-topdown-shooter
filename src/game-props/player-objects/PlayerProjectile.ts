import { css, CSSResult, customElement, html, TemplateResult } from 'lit-element';
import Projectile from '../base/Projectile';

@customElement('player-projectile')
export default class PlayerProjectile extends Projectile {
    lifeTime: number = 100;

    static get styles(): Array<CSSResult> {
        return [
            css`
                :host {
                    width: 8px;
                    height: 16px;
                    border-radius: 25% 25% 0 0;
                    background: #ff6d00;
                    border: 1px solid black;
                }
            `,
        ];
    }

    render(): TemplateResult {
        return html`
            <style>
                ${this.getProjectileBaseStyles()}
            </style>
        `;
    }
}
