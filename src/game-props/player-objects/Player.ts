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
import ColliderMath from '../../game-engine/math/ColliderMath';
import StaticEntity from '../../game-engine/game-entities/StaticEntity';
import TripleMachineGun from '../weapon-objects/TripleMachineGun';

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
    mousePosition: Vector2 = new Vector2(0, 0);
    @property({ type: Number })
    rotation: number = 0;

    // Update if player size is changed
    // Used to center projcetile send location
    distanceToCenter: Vector2 = new Vector2(5, 0);

    previousPosition: Vector2;

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
        this.weapon = new TripleMachineGun();

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
            this.rotation = VectorMath.lookTowards(this.mousePosition, this.position);
            this.setTranslate();
        });
    }

    tick() {
        super.tick();
        this.handleMovement();
        if (this.shooting) {
            this.weapon.handleShoot(
                new Vector2(this.position.x + this.distanceToCenter.x, this.position.y + this.distanceToCenter.y),
                this.mousePosition,
                this.entityId,
            );
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

        // TODO: Check if it's safer to do player collision checks on main thread vs messaging
        if (ColliderMath.isCollidingWithStaticEntity(this.getCollider())) {
            this.position = this.previousPosition;
            this.setTranslate();
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

        this.previousPosition = { ...this.position };
        this.position = new Vector2(xMovement, yMovement);
        this.setTranslate();
    }

    setTranslate() {
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`;
    }

    render() {
        return html``;
    }
}
