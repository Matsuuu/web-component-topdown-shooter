import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';

@customElement('enemy-health-bar')
export default class EnemyHealthBar extends LitElement {
    @property({ type: Number })
    maxFill;
    @property({ type: Number })
    currentFill;
    @property({ type: Number })
    width;
    @property({ type: Number })
    parentWidth;
    @property({ type: Number })
    offsetTop;
    @property({ type: Object })
    fillObject: HTMLElement;

    static get styles() {
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

    // @ts-ignore
    protected firstUpdated(_changedProperties: keyof T extends PropertyKey ? Map<keyof T, unknown> : never): void {
        this.fillObject = this.shadowRoot.querySelector('.fill');
    }

    // @ts-ignore
    protected updated(_changedProperties: keyof T extends PropertyKey ? Map<keyof T, unknown> : never): void {
        if (_changedProperties.has('currentFill')) {
            this.triggerDamageFlash();
        }
    }

    triggerDamageFlash() {
        this.fillObject.classList.add('fill--flash');
        setTimeout(() => {
            this.fillObject.classList.remove('fill--flash');
        }, 100);
    }

    render() {
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
