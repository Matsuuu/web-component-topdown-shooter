import { css, customElement, html } from 'lit-element';
import Projectile from '../base/Projectile';

@customElement('player-projectile')
export default class PlayerProjectile extends Projectile {
    static get styles() {
        return [
            css`
                :host {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: blue;
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
