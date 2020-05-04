import { css, CSSResult, property, unsafeCSS } from 'lit-element';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import VectorMath from '../../game-engine/math/VectorMath';
import Collider from '../../game-engine/game-object-types/Collider';
import WaitUtil from '../../game-engine/apis/wait/WaitUtil';
import Calculator from '../../game-engine/apis/calculation/Calculator';

export default class Projectile extends LitEntity {
    collider: Collider;
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Number })
    damage: number = 0;
    @property({ type: Vector2 })
    heading: Vector2;
    @property({ type: Vector2 })
    targetCoordinates: Vector2;
    /**
     * Lifetime in game ticks.
     *
     * Distance is Heading * lifetime * movementSpeed
     */
    @property({ type: Number })
    lifeTime: number = 1;
    lifeTimeElapsed: number = 0;
    @property({ type: Number })
    rotation: number;
    @property({ type: Number })
    knockBack: number;

    getProjectileBaseStyles(): CSSResult {
        return css`
            :host {
                position: fixed;
                z-index: 1;
                bottom: 0;
                left: 0;
                will-change: transform;
                transition: 0;
            }
        `;
    }

    init(): void {
        super.init();
        this.addEventListener('transitionend', () => this.removeProjectile());
    }

    async setProjectileTrajectory(): Promise<void> {
        this.targetCoordinates = await window.Calculator.getProjectileTarget(
            this.lifeTime,
            this.position,
            this.heading,
            this.movementSpeed,
            this.entityId,
        );
        this.rotation = VectorMath.lookTowards(this.targetCoordinates, this.position);
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`;

        await WaitUtil.wait(50);
        this.style.transition = `${unsafeCSS(window.GameManager.tickDuration * this.lifeTime)}s linear`;

        // This is a absolutely disgusting hack but I'll live with it
        setTimeout(() => {
            window.requestAnimationFrame(() => this.setDestinationTransform());
        }, 10);
    }

    firstUpdated(): void {
        this.setProjectileTrajectory();
    }

    setDestinationTransform(): void {
        this.style.transform = `translate(${this.targetCoordinates.x}px, ${this.targetCoordinates.y}px) rotate(${this.rotation}deg)`;
    }

    tick(): void {
        super.tick();
        this.checkCollisionWithStaticEntities();
        this.lifeTimeElapsed++;
    }

    async getCollider(): Promise<Collider> {
        return this.collider;
    }

    getNextPositionCollider(): Promise<Collider> {
        const size: Vector2 = new Vector2(this.clientWidth, this.clientHeight);
        return window.Calculator.calculateNextColliderPosition(
            this.position,
            this.heading,
            this.movementSpeed,
            size,
            this.rotation,
            this.lifeTimeElapsed,
            this.entityId,
        );
    }

    async checkCollisionWithStaticEntities(): Promise<void> {
        this.collider = await this.getNextPositionCollider();
        window.CollisionCalculator.isCollidingWithStaticEntity(this.collider, this.entityId).then(isColliding => {
            if (isColliding) {
                this.removeProjectile();
            }
        });
    }

    removeProjectile(): void {
        this.removeEntity();
        this.remove();
    }
}
