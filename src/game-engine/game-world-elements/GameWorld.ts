import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { Vector2 } from '../game-object-types/Vector2';

@customElement('game-world')
export default class GameWorld extends LitElement {
    @property({ type: Vector2 })
    size: Vector2 = new Vector2(2000, 2000);
    @property({ type: String })
    styles: string;
    @property({ type: Vector2 })
    position: Vector2 = new Vector2(0, 0);
    @property({ type: Number })
    worldTransitionSpeed: number = 0;

    static get styles(): CSSResult {
        return css`
            :host {
                z-index: -1;
                position: absolute;
                bottom: 0px;
                left: 0px;
                will-change: transform;
            }
        `;
    }

    protected firstUpdated(): void {
        this.setPosition(this.position);
    }

    setPosition(newPosition: Vector2): void {
        this.position = newPosition;
        this.setTransitionSpeed(0);
        this.updateTransform();
    }

    updateTransform(): void {
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.render();
    }

    transitionTo(newPosition: Vector2, transitionSpeed: number = 0): void {
        this.setTransitionSpeed(transitionSpeed);
        this.position = newPosition;
        this.updateTransform();
    }

    setTransitionSpeed(transitionSpeed: number): void {
        this.worldTransitionSpeed = transitionSpeed;
        this.style.transition = `${this.worldTransitionSpeed}ms ease-in-out`;
    }

    render(): TemplateResult {
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
