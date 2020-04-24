import { css, property, unsafeCSS } from 'lit-element';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import VectorMath from '../../game-engine/math/VectorMath';

export default class Projectile extends LitEntity {
    @property({ type: Vector2 })
    position: Vector2;
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
    @property({ type: Number })
    rotation: number;
    @property({ type: Number })
    knockBack: number;

    getProjectileBaseStyles() {
        return css`
            :host {
                position: fixed;
                z-index: 1;
                top: 0;
                left: 0;
                will-change: transform;
                transition: ${unsafeCSS(window.GameManager.tickDuration * this.lifeTime)}s linear;
            }
        `;
    }

    init() {
        super.init();
        this.addEventListener('transitionend', () => this.removeProjectile());
    }

    async setProjectileTrajectory() {
        this.targetCoordinates = await window.Calculator.getProjectileTarget(
            this.lifeTime,
            this.position,
            this.heading,
            this.movementSpeed,
            this.entityId,
        );

        this.rotation = VectorMath.lookTowards(this.targetCoordinates, this.position);
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`;

        // This is a absolutely disgusting hack but I'll live with it
        setTimeout(() => {
            window.requestAnimationFrame(() => this.setDestinationTransform());
        }, 10);
    }

    firstUpdated() {
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.setProjectileTrajectory();
    }

    setDestinationTransform() {
        this.style.transform = `translate(${this.targetCoordinates.x}px, ${this.targetCoordinates.y}px) rotate(${this.rotation}deg)`;
    }

    tick() {
        super.tick();
        this.checkCollisionWithStaticEntities();
    }

    checkCollisionWithStaticEntities() {
        window.CollisionCalculator.isCollidingWithStaticEntity(this.getCollider(), this.entityId).then(isColliding => {
            if (isColliding) {
                this.removeProjectile();
            }
        });
    }

    removeProjectile() {
        this.removeEntity();
        this.remove();
    }
}
