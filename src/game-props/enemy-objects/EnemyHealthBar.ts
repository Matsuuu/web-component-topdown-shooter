import { css, customElement, html, LitElement, property, TemplateResult, unsafeCSS } from 'lit-element';
import { PropertyValues } from 'lit-element/lib/updating-element';
import { CSSResult } from 'lit-element/lib/css-tag';

@customElement('enemy-health-bar')
export default class EnemyHealthBar extends LitElement {
    @property({ type: Number })
    maxFill: number;
    @property({ type: Number })
    currentFill: number;
    @property({ type: Number })
    width: number;
    @property({ type: Number })
    parentWidth: number;
    @property({ type: Number })
    offsetTop: number;
    @property({ type: Object })
    fillObject: HTMLElement;

    static get styles(): CSSResult {
        return css`
            :host {
                display: block;
                position: absolute;
                top: -15px;
                right: 0;
                box-shadow: 2px 2px 5px #484848;
            }

            .fill {
                height: 100%;
            }
        `;
    }

    protected firstUpdated(): void {
        this.fillObject = this.shadowRoot.querySelector('.fill');
    }

    protected updated(_changedProperties: PropertyValues): void {
        if (_changedProperties.has('currentFill')) {
            this.triggerDamageFlash();
        }
    }

    triggerDamageFlash(): void {
        this.fillObject.classList.add('fill--flash');
        setTimeout(() => {
            this.fillObject.classList.remove('fill--flash');
        }, 100);
    }

    render(): TemplateResult {
        return html`
            <style>
                :host {
                    width: ${unsafeCSS(this.width)}px;
                    height: 7px;
                    left: -${unsafeCSS(this.parentWidth / 2)}px;
                    border: 1px solid #000;
                }

                .fill {
                    background: red;
                    width: ${(this.currentFill / this.maxFill) * 100}%;
                }

                .fill--flash {
                    background: #ffaaaa;
                }
            </style>
            <div class="fill"></div>
        `;
    }
}
