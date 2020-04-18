import { LitEntity } from './game-entities/LitEntity';
import { css, customElement, html, property } from 'lit-element';

@customElement('entity-counter')
class EntityCounter extends LitEntity {
    @property({ type: Number })
    entityCount: number;

    static get styles() {
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

    tick() {
        this.entityCount = window.GameManager.entities.length;
    }

    render() {
        return html`
            <p>Entity count: ${this.entityCount}</p>
        `;
    }
}
