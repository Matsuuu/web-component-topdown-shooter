import { css, property, unsafeCSS } from 'lit-element';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import { Boundary, getXBoundary, getYBoundary } from '../../game-engine/Boundaries';

export default class Projectile extends LitEntity {
    @property({ type: Number })
    x: number;
    @property({ type: Number })
    y: number;
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Vector2 })
    heading: Vector2;
    // Coordinates at which the object crosses the screen.
    // Used for translate position so the projectile navigates to
    // correct direction
    @property({ type: Vector2 })
    crossingCoordinates: Vector2;
    // Lifetime in game ticks
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
        this.maxLifeTime = this.determineTickCount();
        this.crossingCoordinates = this.determineCrossPoint();
    }

    firstUpdated() {
        super.firstUpdated();
        this.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.addEventListener('transitionend', () => this.removeProjectile());

        if (!Number.isFinite(this.maxLifeTime)) {
            // Dirty hack to remove projectile if we get a invalid transition duration
            this.removeProjectile();
        }

        // We need to figure out a better way to make sure the element has hit the dom
        setTimeout(() => {
            this.setDestinationTransform();
        }, 10);
    }

    setDestinationTransform() {
        this.style.transform = `translate(${this.crossingCoordinates.x}px, ${this.crossingCoordinates.y}px)`;
    }

    tick() {
        super.tick();
        this.lifetime++;
    }

    removeProjectile() {
        this.removeEntity();
        this.remove();
    }

    // TODO: Move these to vector math folders
    determineProjectileXCrossTicks(): number {
        if (this.heading.x < 0) {
            // Ticks until crosses on left side
            return Math.ceil(this.x / this.movementSpeed / Math.abs(this.heading.x)) + 1;
        }
        // Ticks until crosses on right side
        const xBoundary: Boundary = getXBoundary();
        return Math.ceil((xBoundary.max - this.x) / this.movementSpeed / this.heading.x) + 1;
    }

    determineProjectileYCrossTicks(): number {
        if (this.heading.y < 0) {
            // Ticks until crosses top
            return Math.ceil(this.y / this.movementSpeed / Math.abs(this.heading.y)) + 1;
        }
        // Ticks until crosses on bottom
        let yBoundary: Boundary = getYBoundary();
        return Math.ceil((yBoundary.max - this.y) / this.movementSpeed / this.heading.y) + 1;
    }

    /**
     * Determine the count of game ticks until this object crosses the play area border
     */
    determineTickCount(): number {
        let xCrossTicks = this.determineProjectileXCrossTicks();
        let yCrossTicks = this.determineProjectileYCrossTicks();

        return Math.min(xCrossTicks, yCrossTicks);
    }

    determineCrossPoint(): Vector2 {
        const ticksToCross = this.maxLifeTime;
        let crossCoords = { x: null, y: null };
        if (this.heading.y < 0) {
            crossCoords.y = this.y - ticksToCross * this.movementSpeed * Math.abs(this.heading.y);
        } else {
            crossCoords.y = this.movementSpeed * ticksToCross + this.y * this.heading.y;
        }

        if (this.heading.x < 0) {
            crossCoords.x = this.x - ticksToCross * this.movementSpeed * Math.abs(this.heading.x);
        } else {
            crossCoords.x = this.x + ticksToCross * this.movementSpeed * this.heading.x;
        }

        return crossCoords;
    }
}
