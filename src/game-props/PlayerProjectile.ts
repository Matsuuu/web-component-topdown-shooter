import { css, customElement, html, unsafeCSS } from 'lit-element';
import { getXBoundary, getYBoundary } from '../game-engine/Boundaries';
import Projectile from './base/Projectile';
import BoundaryMath from '../game-engine/math/BoundaryMath';
import { Vector2 } from '../game-engine/game-object-types/Vector2';

@customElement('player-projectile')
export default class PlayerProjectile extends Projectile {
    static get styles() {
        return [
            css`
                :host {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: blue;
                }
            `,
        ];
    }

    firstUpdated() {
        super.firstUpdated();
    }

    tick() {
        super.tick();
        //this.handleBoundaries();
        //this.getNextPosition();
    }

    handleBoundaries(): void {
        if (BoundaryMath.isOutsideBoundary(new Vector2(this.x, this.y), getXBoundary(), getYBoundary())) {
            this.removeEntity();
            this.remove();
        }
    }

    getNextPosition(): void {
        window.Calculator.calculateNextPosition(
            new Vector2(this.x, this.y),
            this.heading,
            this.movementSpeed,
            this.entityId,
        ).then((result: Vector2) => {
            this.x = result.x;
            this.y = result.y;
            this.style.transform = `translate(${this.x}px, ${this.y}px)`;
        });
    }

    render() {
        return html`
            <style>
                ${this.getProjectileBaseStyles()}
            </style>
        `;
    }
}
