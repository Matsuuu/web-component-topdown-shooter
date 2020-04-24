import { css, customElement, html, LitElement, property } from 'lit-element';
import { Vector2 } from '../game-object-types/Vector2';

@customElement('game-world')
export default class GameWorld extends LitElement {
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
                bottom: 0;
                left: 0;
            }
        `;
    }

    protected firstUpdated(): void {
        this.setPosition(this.position);
    }

    setPosition(newPosition: Vector2): void {
        console.log('newPosition', newPosition);
        this.position = newPosition;
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.render();
    }

    transitionTo(newPosition: Vector2): void {
        this.position = newPosition;
        this.render();
    }

    render() {
        console.log('Gameworld render', this.position);
        return html`
            <style>
                ${this.styles} :host {
                    width: ${this.size.x}px;
                    height: ${this.size.y}px;
                }
            </style>
            <slot></slot>
        `;
    }
}
