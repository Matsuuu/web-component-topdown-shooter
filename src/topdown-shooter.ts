import { LitElement, html, customElement, css } from 'lit-element';
import GameManager, { GameManagerParams } from './game-engine/GameManager';
import './game-props/player-objects/Player';
import './game-props/enemy-objects/ShooterEnemy';
import './game-props/world-objects/Structure';
import { Vector2 } from './game-engine/game-object-types/Vector2';

@customElement('topdown-shooter')
class TopdownShooter extends LitElement {
    constructor() {
        super();
    }

    protected firstUpdated(): void {
        const gameWorld = this.shadowRoot.querySelector('game-world');
        const gameManager = new GameManager({ gameWrapper: gameWorld, gameWorld } as GameManagerParams);
        gameManager.startGame();
    }

    static get styles() {
        return css`
            .instructions {
                position: absolute;
                bottom: 0;
                left: 0;
                pointer-events: none;
                padding: 1rem;
                border: 2px solid #484848;
                background: #fff;
            }

            p {
                user-select: none;
            }
        `;
    }

    gameWorldStyles() {
        return `
            :host {
                position: absolute;
                background-color: #f5edef;
                background-image: url('https://www.transparenttextures.com/patterns/batthern.png');
                /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
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
            <game-world
                .size="${new Vector2(4000, 4000)}"
                .position="${new Vector2(0, -3000)}"
                .styles="${this.gameWorldStyles()}"
            >
                <terrain .styles="${this.gameWorldStyles()}"></terrain>
                <player-element .position="${new Vector2(400, 3500)}"></player-element>
                <shooter-enemy .position="${new Vector2(400, 3100)}"></shooter-enemy>
                <shooter-enemy .position="${new Vector2(600, 3120)}"></shooter-enemy>
                <shooter-enemy .position="${new Vector2(800, 3110)}"></shooter-enemy>

                <world-structure
                    .worldPosition="${new Vector2(300, 3300)}"
                    .size="${new Vector2(50, 100)}"
                ></world-structure>

                <world-structure
                    .worldPosition="${new Vector2(200, 3300)}"
                    .size="${new Vector2(50, 100)}"
                ></world-structure>

                <world-structure
                    .worldPosition="${new Vector2(300, 3600)}"
                    .size="${new Vector2(500, 100)}"
                ></world-structure>
            </game-world>
        `;
    }
}
