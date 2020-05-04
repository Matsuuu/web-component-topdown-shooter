import { LitElement, html, customElement, css, CSSResult, TemplateResult } from 'lit-element';
import GameManager, { GameManagerParams } from './game-engine/GameManager';
import './game-props/player-objects/Player';
import './game-props/enemy-objects/ShooterEnemy';
import './game-props/world-objects/Structure';
import { Vector2 } from './game-engine/game-object-types/Vector2';
import GameWorld from './game-engine/game-world-elements/GameWorld';
import Structure from './game-props/world-objects/Structure';

@customElement('topdown-shooter')
export default class TopdownShooter extends LitElement {
    constructor() {
        super();
    }

    protected firstUpdated(): void {
        const gameWorld: GameWorld = this.shadowRoot.querySelector('game-world');
        const gameManager: GameManager = new GameManager({ gameWrapper: gameWorld, gameWorld } as GameManagerParams);
        gameManager.startGame();

        const testElem: Structure = this.shadowRoot.querySelector('#test');
        /*window.addEventListener('keydown', () => {
            console.log(testElem.position);
            console.log(testElem.getCollider());
            testElem.rotation += 5;
        });*/
    }

    static get styles(): CSSResult {
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

    gameWorldStyles(): string {
        return `
            :host {
                position: absolute;
                background-color: #f5edef;
                background-image: url('https://www.transparenttextures.com/patterns/batthern.png');
                /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
                width: 100%;
                height: 100%;
            }
      `;
    }

    render(): TemplateResult {
        return html`
            <entity-counter></entity-counter>
            <div class="instructions">
                <p>WASD TO MOVE</p>
                <p>Mouse click to shoot</p>
            </div>
            <game-world
                .size="${new Vector2(4000, 4000)}"
                .position="${new Vector2(0, 0)}"
                .styles="${this.gameWorldStyles()}"
            >
                <terrain .styles="${this.gameWorldStyles()}"></terrain>
                <player-element .position="${new Vector2(800, -500)}"></player-element>
                <shooter-enemy .position="${new Vector2(800, -900)}"></shooter-enemy>
                <shooter-enemy .position="${new Vector2(550, -850)}"></shooter-enemy>
                <shooter-enemy .position="${new Vector2(750, -950)}"></shooter-enemy>

                <world-structure
                    .position="${new Vector2(500, -600)}"
                    .size="${new Vector2(50, 100)}"
                ></world-structure>

                <world-structure
                    id="test"
                    .position="${new Vector2(400, -600)}"
                    .size="${new Vector2(50, 100)}"
                    rotation="30"
                ></world-structure>

                <world-structure
                    .position="${new Vector2(600, -300)}"
                    .size="${new Vector2(500, 100)}"
                ></world-structure>

                <world-structure
                    .position="${new Vector2(1500, -400)}"
                    .size="${new Vector2(100, 500)}"
                ></world-structure>

                <world-structure
                    .position="${new Vector2(1200, -1200)}"
                    .size="${new Vector2(500, 100)}"
                ></world-structure>
            </game-world>
        `;
    }
}
