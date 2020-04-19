import { LitElement, html, customElement, css } from 'lit-element';
import GameManager, { GameManagerParams } from './game-engine/GameManager';
import './game-props/player-objects/Player';
import './game-props/enemy-objects/ShooterEnemy';
import { Vector2 } from './game-engine/game-object-types/Vector2';

@customElement('topdown-shooter')
class TopdownShooter extends LitElement {
    constructor() {
        super();
        const gameManager = new GameManager({ gameWrapper: this, gameWorld: this.shadowRoot } as GameManagerParams);
        gameManager.startGame();
    }

    protected firstUpdated(): void {}

    static get styles() {
        return css`
            :host {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .instructions {
                position: absolute;
                bottom: 0;
                left: 0;
                pointer-events: none;
                padding: 1rem;
                border: 2px solid #484848;
            }

            p {
                user-select: none;
            }
        `;
    }

    render() {
        return html`
            <entity-counter></entity-counter>
            <div class="instructions">
                <p>WASD TO MOVE</p>
                <p>Mouse click to shoot</p>
            </div>
            <player-element></player-element>
            <shooter-enemy .position="${new Vector2(400, 100)}"></shooter-enemy>
            <shooter-enemy .position="${new Vector2(600, 120)}"></shooter-enemy>
            <shooter-enemy .position="${new Vector2(800, 110)}"></shooter-enemy>
        `;
    }
}

export default TopdownShooter;
