import { LitElement, html, customElement, css } from 'lit-element';
import GameManager, { GameManagerParams } from './game-engine/GameManager';
import './game-props/Player';
import './game-engine/EntityCounter';

@customElement('topdown-shooter')
class TopdownShooter extends LitElement {
    constructor() {
        super();
        const gameManager = new GameManager({ gameWorld: this } as GameManagerParams);
        gameManager.startGame();
    }

    protected firstUpdated(): void {}

    static get styles() {
        return css`
            .instructions {
                position: fixed;
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
        `;
    }
}

export default TopdownShooter;
