import { LitEntity } from '../game-entities/LitEntity';
import { css, CSSResult, customElement, html, property, TemplateResult } from 'lit-element';

@customElement('entity-counter')
export default class EntityCounter extends LitEntity {
    @property({ type: Number })
    entityCount: number;

    static get styles(): CSSResult {
        return css`
            :host {
                position: fixed;
                top: 0;
                right: 4rem;
                font-size: 1.4rem;
                color: #484848;
            }

            p {
                margin: 0.5rem 0;
                user-select: none;
            }
        `;
    }

    init(): void {
        super.init();
    }

    tick(): void {
        this.entityCount = window.GameManager.entities.length;
    }

    render(): TemplateResult {
        return html`
            <p>Entity count: ${this.entityCount}</p>
        `;
    }
}