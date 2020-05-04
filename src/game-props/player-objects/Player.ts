import { css, CSSResult, customElement, html, property, TemplateResult } from 'lit-element';
import './PlayerProjectile';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import VectorMath from '../../game-engine/math/VectorMath';
import normalShadow from './../style-objects/NormalShadow';
import Weapon from '../base/Weapon';
import ColliderMath from '../../game-engine/math/ColliderMath';
import SMG from '../weapon-objects/SMG';
import Collider from '../../game-engine/game-object-types/Collider';

const controlKeys: Array<string> = ['w', 'a', 's', 'd'];

@customElement('player-element')
export default class Player extends LitEntity {
    @property({ type: Array })
    movementDirections: Array<string> = [];
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Weapon })
    weapon: Weapon;
    @property({ type: Boolean })
    shooting: boolean = false;
    @property({ type: Vector2 })
    mousePosition: Vector2 = new Vector2(0, 0);

    // Update if player size is changed
    // Used to center projcetile send location
    distanceToCenter: Vector2 = new Vector2(5, 0);

    previousPosition: Vector2;

    static get styles(): Array<CSSResult> {
        return [
            normalShadow,
            css`
                :host {
                    position: absolute;
                    bottom: 0;
                    left: 0;

                    display: block;
                    width: 20px;
                    height: 20px;
                    background: green;
                    border-radius: 2.5px;

                    animation: pump 1s infinite;

                    will-change: transform;
                }
            `,
        ];
    }

    init(): void {
        super.init();
        this.movementDirections = [];
        this.movementSpeed = 200 / window.GameManager.tickRate;
        this.weapon = new SMG(this);

        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.handleControl(e.key);
        });
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (controlKeys.includes(e.key)) {
                this.movementDirections = this.movementDirections.filter(key => key !== e.key);
            }
        });
        document.addEventListener('mousedown', () => {
            this.shooting = true;
        });
        document.addEventListener('mouseup', () => {
            this.shooting = false;
        });
        document.addEventListener('mousemove', (e: MouseEvent) => {
            const mousePosition: Vector2 = new Vector2(e.x, e.y).reverse();
            const relativeMousePosition: Vector2 = window.Camera.getRelativeMousePosition(mousePosition);
            this.mousePosition = relativeMousePosition;

            this.rotation = VectorMath.lookTowards(relativeMousePosition, this.position);
            this.setTranslate();
        });

        window.Camera.follow(this);
    }

    tick(): void {
        this.handleMovement();
        this.handleShooting();
    }

    handleShooting(): void {
        if (this.shooting) {
            this.weapon.handleShoot(
                new Vector2(this.position.x + this.distanceToCenter.x, this.position.y + this.distanceToCenter.y),
                this.mousePosition,
                this.entityId,
            );
        }
    }

    handleControl(key: string): void {
        if (controlKeys.includes(key) && !this.movementDirections.includes(key)) {
            this.movementDirections.push(key);
        }
    }

    async handleMovement(): Promise<void> {
        if (this.movementDirections.length < 1) {
            return;
        }

        // TODO: Check if it's safer to do player collision checks on main thread vs messaging
        // And fix the glitchy collision check
        const collider: Collider = await this.getCollider();
        if (await ColliderMath.isCollidingWithStaticEntity(collider)) {
            this.position = this.previousPosition;
            this.setTranslate();
            return;
        }

        let xMovement: number = this.position.x;
        let yMovement: number = this.position.y;
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

        this.previousPosition = { ...this.position } as Vector2;
        this.position = new Vector2(xMovement, yMovement);
        this.setTranslate();
    }

    setTranslate(): void {
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`;
    }

    render(): TemplateResult {
        return html``;
    }
}
