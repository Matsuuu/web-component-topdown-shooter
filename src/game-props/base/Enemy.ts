import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { css, CSSResult, property, PropertyValues, unsafeCSS } from 'lit-element';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import Projectile from './Projectile';
import PlayerProjectile from '../player-objects/PlayerProjectile';
import ColliderMath from '../../game-engine/math/ColliderMath';
import CollisionEvent from '../../game-engine/game-object-types/CollisionEvent';
import Player from '../player-objects/Player';

export default class Enemy extends LitEntity {
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Number })
    health: number;
    @property({ type: Number })
    maxHealth: number;
    @property({ type: Function })
    deathActions: Function;
    @property({ type: Boolean })
    healthBarIsShowing: boolean = false;
    @property({ type: Boolean })
    canBeKnockedBack: boolean = true;

    player: Player;

    init(): void {
        super.init();
        this.player = window.GameManager.gameWorld.querySelector('player-element');
    }

    reduceHealth(amount: number): void {
        this.health -= amount;
        if (this.health < 0) {
            this.initiateDeath();
        }
    }

    initiateDeath(): void {
        if (this.deathActions) {
            this.deathActions.call(this);
        }
        this.removeEntity();
        this.remove();
    }

    tick(): void {
        this.handlePlayerProjectileCollision();
    }

    async checkPlayerProjectileCollisions(): Promise<Array<CollisionEvent>> {
        const collisionEvents: Array<CollisionEvent> = [];

        const collisionEventPromises: Array<Promise<void>> = this.getPlayerProjectiles().map(
            async (proj: PlayerProjectile) => {
                const collision: CollisionEvent = await ColliderMath.getCollision(proj, this);
                if (collision) {
                    collisionEvents.push(collision);
                    proj.removeProjectile();
                }
            },
        );
        await Promise.all(collisionEventPromises);
        return collisionEvents;
    }

    async handlePlayerProjectileCollision(): Promise<void> {
        const collisionEvents: Array<CollisionEvent> = await this.checkPlayerProjectileCollisions();
        if (collisionEvents.length > 0) {
            collisionEvents.forEach(ev => {
                const projectile: Projectile = ev.source as Projectile;
                ev.collisionDirection.add(projectile.heading);
                this.reduceHealth(projectile.damage);
                this.handleKnockBack(ev.collisionDirection, projectile.knockBack);
            });
        }
    }

    handleKnockBack(collisionDirection: Vector2, knockBack: number): void {
        if (this.canBeKnockedBack) {
            this.position.reduce(collisionDirection.multiply(knockBack).reverse());
        }
    }

    getPlayerProjectiles(): Array<PlayerProjectile> {
        return window.GameManager.entities.filter(ent => ent instanceof PlayerProjectile) as Array<PlayerProjectile>;
    }

    protected updated(_changedProperties: PropertyValues): void {
        if (_changedProperties.has('health')) {
            this.triggerDamageFlash();
        }
    }

    triggerDamageFlash(): void {
        this.classList.add('damage-flash');
        setTimeout(() => {
            this.classList.remove('damage-flash');
        }, 50);
    }

    getDamageFlashStyles(): CSSResult {
        return css`
            :host(.damage-flash) {
                background: darkgrey;
                transform: ${unsafeCSS(this.style.transform)} scale(1.1dw) !important;
            }
        `;
    }

    getPositionStyles(): CSSResult {
        return css`
            :host {
                transition: 100ms linear transform;
                transform: translate(${unsafeCSS(this.position.x)}px, ${unsafeCSS(this.position.y)}px);
            }
        `;
    }
}
