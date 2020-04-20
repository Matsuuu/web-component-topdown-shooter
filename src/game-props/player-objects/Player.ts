import { css, customElement, html, property } from 'lit-element';
import PlayerProjectile from './PlayerProjectile';
import './PlayerProjectile';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import VectorMath from '../../game-engine/math/VectorMath';
import normalShadow from './../style-objects/NormalShadow';
import Weapon from '../base/Weapon';
import Pistol from '../weapon-objects/Pistol';
import Shotgun from '../weapon-objects/Shotgun';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';
import SMG from '../weapon-objects/SMG';

const controlKeys = ['w', 'a', 's', 'd'];

@customElement('player-element')
class Player extends LitEntity {
    @property({ type: Array<String>() })
    movementDirections: Array<String>;
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Vector2 })
    position: Vector2;
    @property({ type: Weapon })
    weapon: Weapon;
    @property({ type: Boolean })
    shooting: boolean = false;
    @property({ type: Vector2 })
    mousePosition: Vector2;

    static get styles() {
        return [
            normalShadow,
            css`
                :host {
                    position: absolute;
                    top: 0;
                    left: 0;

                    display: block;
                    width: 20px;
                    height: 20px;
                    background: green;
                    border-radius: 2.5px;
                    z-index: 10;

                    will-change: transform;
                }
            `,
        ];
    }

    constructor() {
        super();
        this.movementDirections = [];
        this.movementSpeed = 200 / window.GameManager.tickRate;
        this.position = new Vector2(0, 0);
    }

    firstUpdated() {
        super.firstUpdated();
        this.weapon = new SMG();

        this.position.x = window.innerWidth / 2;
        this.position.y = window.innerHeight / 2;
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.handleControl(e.key);
        });
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (controlKeys.includes(e.key)) {
                this.movementDirections = this.movementDirections.filter(key => key !== e.key);
            }
        });
        document.addEventListener('mousedown', (e: MouseEvent) => {
            this.shooting = true;
        });
        document.addEventListener('mouseup', (e: MouseEvent) => {
            this.shooting = false;
        });
        document.addEventListener('mousemove', (e: MouseEvent) => {
            this.mousePosition = new Vector2(e.x, e.y);
        });
    }

    tick() {
        super.tick();
        this.handleMovement();
        if (this.shooting) {
            this.weapon.handleShoot(this.position, this.mousePosition, this.entityId);
        }
    }

    handleControl(key: string) {
        if (controlKeys.includes(key) && !this.movementDirections.includes(key)) {
            this.movementDirections.push(key);
        }
    }

    handleMovement() {
        if (this.movementDirections.length < 1) {
            return;
        }
        let xMovement = this.position.x;
        let yMovement = this.position.y;
        if (this.movementDirections.includes('w')) {
            yMovement -= this.movementSpeed;
        }
        if (this.movementDirections.includes('a')) {
            xMovement -= this.movementSpeed;
        }
        if (this.movementDirections.includes('s')) {
            yMovement += this.movementSpeed;
        }
        if (this.movementDirections.includes('d')) {
            xMovement += this.movementSpeed;
        }
        this.position = new Vector2(xMovement, yMovement);
        this.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
    }

    render() {
        return html``;
    }
}
