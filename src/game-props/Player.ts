import { css, customElement, property } from 'lit-element';
import PlayerProjectile from './PlayerProjectile';
import './PlayerProjectile';
import { Vector2 } from '../game-engine/game-object-types/Vector2';
import { LitEntity } from '../game-engine/game-entities/LitEntity';
import VectorMath from '../game-engine/math/VectorMath';
import { getXBoundary, getYBoundary } from '../game-engine/Boundaries';

const controlKeys = ['w', 'a', 's', 'd'];

@customElement('player-element')
class Player extends LitEntity {
    @property({ type: Array<String>() })
    movementDirections: Array<String>;
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Vector2 })
    position: Vector2;
    @property({ type: Boolean })
    useWorker: boolean = true;

    static get properties() {
        return {
            movementDirections: { type: Array },
            movementSpeed: { type: Number },

            position: { type: Object },
        };
    }

    static get styles() {
        return css`
            :host {
                position: absolute;
                top: 0;
                left: 0;

                display: block;
                width: 5px;
                height: 5px;
                background: red;
                border-radius: 5px;

                will-change: transform;
            }
        `;
    }

    constructor() {
        super();
        this.movementDirections = [];
        this.movementSpeed = 200 / window.GameManager.tickRate;
        this.position = new Vector2(0, 0);
    }

    firstUpdated() {
        super.firstUpdated();

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
        document.addEventListener('mousemove', (e: MouseEvent) => {
            this.handleShoot(new Vector2(e.x, e.y));
        });
    }

    handleShoot(coords: Vector2) {
        if (this.useWorker) {
            window.Calculator.calculateHeading(this.position, coords, this.entityId).then(heading =>
                this.spawnProjectile(heading),
            );
        } else {
            this.spawnProjectile(VectorMath.calculateHeading(this.position, new Vector2(coords.x, coords.y)));
        }
    }

    spawnProjectile(heading) {
        const projectile = document.createElement('player-projectile') as PlayerProjectile;
        projectile.x = this.position.x;
        projectile.y = this.position.y;
        projectile.movementSpeed = 300 / window.GameManager.tickRate;
        projectile.heading = heading;
        window.GameManager.spawnEntity(projectile);
    }

    tick() {
        super.tick();
        this.handleMovement();
    }

    handleControl(key) {
        if (controlKeys.includes(key) && !this.movementDirections.includes(key)) {
            this.movementDirections.push(key);
        }
    }

    handleMovement() {
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
}
