import { css, property, unsafeCSS } from 'lit-element';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';

export default class Projectile extends LitEntity {
    @property({ type: Vector2 })
    position: Vector2;
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Number })
    damage: number = 0;
    @property({ type: Vector2 })
    heading: Vector2;
    // Coordinates at which the object crosses the screen.
    // Used for translate position so the projectile navigates to
    // correct direction
    @property({ type: Vector2 })
    crossingCoordinates: Vector2;
    /**
     * Lifetime in game ticks.
     * If one wants the projectiles to disappear as they leave the screen,
     * one doesn't need to do anything with this.
     *
     * If however one wants to put a lifetime for projectiles, this is here for that purpose.
     */
    @property({ type: Number })
    lifetime: number = 0;
    // Time until we kill the projectile unless it has hit something
    @property({ type: Number })
    maxLifeTime: number = 0;

    getProjectileBaseStyles() {
        return css`
            :host {
                position: absolute;
                top: 0;
                left: 0;
                will-change: transform;
                transition: ${unsafeCSS(window.GameManager.tickDuration * this.maxLifeTime)}s linear;
            }
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('transitionend', () => this.removeProjectile());
    }

    async setProjectileTrajectory() {
        this.maxLifeTime = await window.Calculator.calculateProjectileLifetime(
            this.position,
            this.heading,
            this.movementSpeed,
            this.entityId,
        );
        this.crossingCoordinates = await window.Calculator.determineCrossPoint(
            this.maxLifeTime,
            this.position,
            this.heading,
            this.movementSpeed,
            this.entityId,
        );
        // This is a absolutely disgusting hack but I'll live with it
        setTimeout(() => {
            window.requestAnimationFrame(() => this.setDestinationTransform());
        }, 10);
    }

    firstUpdated() {
        super.firstUpdated();
        this.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.setProjectileTrajectory();
    }

    setDestinationTransform() {
        this.style.transform = `translate(${this.crossingCoordinates.x}px, ${this.crossingCoordinates.y}px)`;
    }

    tick() {
        super.tick();
    }

    removeProjectile() {
        this.removeEntity();
        this.remove();
    }
}
