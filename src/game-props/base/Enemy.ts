import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { css, property } from 'lit-element';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import BoundaryMath from '../../game-engine/math/BoundaryMath';
import Projectile from './Projectile';
import PlayerProjectile from '../player-objects/PlayerProjectile';
import ColliderMath from '../../game-engine/math/ColliderMath';
import CollisionEvent from '../../game-engine/game-object-types/CollisionEvent';

export default class Enemy extends LitEntity {
    @property({ type: Number })
    movementSpeed: number;
    @property({ type: Vector2 })
    position: Vector2;
    @property({ type: Number })
    health: number;
    @property({ type: Number })
    maxHealth: number;
    @property({ type: Function })
    deathActions;
    @property({ type: Boolean })
    healthBarIsShowing = false;

    protected firstUpdated(): void {
        super.firstUpdated();
    }

    reduceHealth(amount: number) {
        this.health -= amount;
        if (this.health < 0) {
            this.initiateDeath();
        }
    }

    initiateDeath() {
        if (this.deathActions) {
            this.deathActions.call();
        }
        this.removeEntity();
        this.remove();
    }

    tick() {
        super.tick();
        this.handlePlayerProjectileCollision();
    }

    checkPlayerProjectileCollisions(): Array<CollisionEvent> {
        let collisionEvents: Array<CollisionEvent> = [];
        this.getPlayerProjectiles().map((proj: PlayerProjectile) => {
            if (ColliderMath.isColliding(this.getCollider(), proj.getCollider())) {
                collisionEvents.push(new CollisionEvent(this, proj));
                proj.removeProjectile();
            }
        });
        return collisionEvents;
    }

    handlePlayerProjectileCollision(): void {
        let collisionEvents: Array<CollisionEvent> = this.checkPlayerProjectileCollisions();
        if (collisionEvents.length > 0) {
            collisionEvents.forEach(ev => {
                const projectile = ev.source as Projectile;
                this.reduceHealth(projectile.damage);
            });
        }
    }

    getPlayerProjectiles(): Array<PlayerProjectile> {
        return window.GameManager.entities.filter(ent => ent instanceof PlayerProjectile) as Array<PlayerProjectile>;
    }

    // @ts-ignore
    protected updated(_changedProperties: keyof T extends PropertyKey ? Map<keyof T, unknown> : never): void {
        if (_changedProperties.has('health')) {
            this.triggerDamageFlash();
        }
    }

    triggerDamageFlash() {
        this.classList.add('damage-flash');
        setTimeout(() => {
            this.classList.remove('damage-flash');
        }, 50);
    }
}
