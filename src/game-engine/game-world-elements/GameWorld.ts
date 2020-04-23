import { css, customElement, html, LitElement, property } from 'lit-element';
import { Vector2 } from '../game-object-types/Vector2';

@customElement('game-world')
class GameWorld extends LitElement {
    @property({ type: Vector2 })
    size: Vector2 = new Vector2(2000, 2000);
    @property({ type: Object })
    styles;
    @property({ type: Vector2 })
    position = new Vector2(0, 0);

    static get styles() {
        return css`
            :host {
                z-index: -1;
                position: absolute;
                top: 0;
                left: 0;
            }
        `;
    }

    render() {
        return html`
            <style>
                ${this.styles} :host {
                    width: ${this.size.x}px;
                    height: ${this.size.y}px;
                    transform: translate(${this.position.x}px, ${this.position.y}px);
                }
            </style>
            <slot></slot>
        `;
    }
}
