import { css, CSSResult, customElement, html, LitElement, property, PropertyValues, TemplateResult } from 'lit-element';
import WaitUtil from '../apis/wait/WaitUtil';

export interface DebugSettings {
    showEntityCount: boolean;
}

const defaultDebugSettings: DebugSettings = {
    showEntityCount: true,
};

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const debugSettingsKey: string = 'debugSettings';

@customElement('debug-options')
export default class DebugOptions extends LitElement {
    @property({ type: Boolean })
    isOpen: boolean = false;
    @property({ type: Object })
    debugSettings: DebugSettings;

    protected firstUpdated(_changedProperties: PropertyValues): void {
        const debugSettings: DebugSettings = JSON.parse(localStorage.getItem(debugSettingsKey));
        if (!debugSettings) {
            localStorage.setItem(debugSettingsKey, JSON.stringify(defaultDebugSettings));
        }
        this.debugSettings = debugSettings;
    }

    async toggleDebugOptions(): Promise<void> {
        await WaitUtil.wait(100);
        this.isOpen = !this.isOpen;
    }

    toggleOption(e: Event): void {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        const id: string = target.id;
        const newValue: boolean = target.checked;
        console.log({ id, newValue });

        this.debugSettings[id] = newValue;
        localStorage.setItem(debugSettingsKey, JSON.stringify(this.debugSettings));
    }

    render(): TemplateResult {
        return html`
            <div
                class="debug-options-menu${this.isOpen ? ' debug-options-menu--open' : ''}"
                @click="${(): void => {
                    if (!this.isOpen) this.toggleDebugOptions();
                }}"
            >
                ${this.isOpen
                    ? html`
                          <p @click="${this.toggleDebugOptions}" class="debug-options-close-button">X</p>
                          <div class="debug-options-list">
                              <p>Show entity count</p>
                              <input
                                  type="checkbox"
                                  id="showEntityCount"
                                  @change="${this.toggleOption}"
                                  ?checked="${this.debugSettings['showEntityCount']}"
                              />
                          </div>
                      `
                    : html`
                          <div class="closed-lines"></div>
                          <div class="closed-lines"></div>
                          <div class="closed-lines"></div>
                      `}
            </div>
        `;
    }

    static get styles(): CSSResult {
        return css`
            :host {
                position: fixed;
                bottom: 0;
                right: 0;
                transition: 1s ease-in-out;
            }

            :host(.debug-list-open) {
            }

            .debug-options-menu {
                border: 2px solid;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                background: rgba(255, 255, 255, 0.8);
                width: 30px;
                height: 30px;
                transition: 0.2s ease-in-out;
                cursor: pointer;
            }

            .debug-options-menu--open {
                justify-content: flex-start;
                width: 400px;
                height: 250px;
                position: relative;
                cursor: initial;
            }

            .debug-options-close-button {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                cursor: pointer;
                margin: 0;
            }

            .debug-options-list {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin: 0 0 0 1rem;
            }

            .debug-options-list > p {
                margin-right: 1rem;
            }

            .closed-lines {
                width: 80%;
                margin: 0 auto;
                height: 2px;
                background: #000;
            }
        `;
    }
}
