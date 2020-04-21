import { css, customElement, html } from 'lit-element';
import Projectile from '../base/Projectile';

@customElement('player-projectile')
export default class PlayerProjectile extends Projectile {
    static get styles() {
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

    render() {
        return html`
            <style>
                ${this.getProjectileBaseStyles()}
            </style>
        `;
    }
}
