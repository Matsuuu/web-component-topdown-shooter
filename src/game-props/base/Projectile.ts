import { css, CSSResult, property, unsafeCSS } from 'lit-element';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import VectorMath from '../../game-engine/math/VectorMath';
import Collider from '../../game-engine/game-object-types/Collider';
import WaitUtil from '../../game-engine/apis/wait/WaitUtil';
import Calculator from '../../game-engine/apis/calculation/Calculator';

interface ColliderPositionTransformation {
    topLeft: Vector2;
    topRight: Vector2;
    bottomLeft: Vector2;
    bottomRight: Vector2;
    center: Vector2;
}

export default class Projectile extends LitEntity {
    collider: Collider;
    colliderPositionTransformation: ColliderPositionTransformation;
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

    async getNextPositionCollider(): Promise<Collider> {
        if (this.colliderPositionTransformation) {
            const coll: Collider = this.collider;
            coll.topLeft = Vector2.from(coll.topLeft).reduce(this.colliderPositionTransformation.topLeft);
            coll.topRight = Vector2.from(coll.topRight).reduce(this.colliderPositionTransformation.topRight);
            coll.bottomRight = Vector2.from(coll.bottomRight).reduce(this.colliderPositionTransformation.bottomRight);
            coll.bottomLeft = Vector2.from(coll.bottomLeft).reduce(this.colliderPositionTransformation.bottomLeft);
            return coll;
        }

        const size: Vector2 = new Vector2(this.clientWidth, this.clientHeight);
        const collider: Collider = await window.Calculator.calculateNextColliderPosition(
            this.position,
            this.heading,
            this.movementSpeed,
            size,
            this.rotation,
            this.lifeTimeElapsed,
            this.entityId,
        );
        // The collider calculations are a bit shaky on the first ticks of lifetime
        // so let's take the reading at tick 3+
        // TODO: Maybe make this less wonky? :D
        if (this.lifeTimeElapsed > 2) {
            /*
             * After the collision calculations have stabilized, we save the offset on every tick the colldiers
             * have, and apply it to the collider manually instead of calculating all of the collider
             * points with advanced math.
             * This should be an optimization, but we'll see.
             *
             * Might fuck around and offload this to workers later
             *
             *
             * */
            this.colliderPositionTransformation = {
                topLeft: Vector2.from(this.collider.topLeft).reduce(collider.topLeft),
                topRight: Vector2.from(this.collider.topRight).reduce(collider.topRight),
                bottomRight: Vector2.from(this.collider.bottomRight).reduce(collider.bottomRight),
                bottomLeft: Vector2.from(this.collider.bottomLeft).reduce(collider.bottomLeft),
                center: Vector2.from(this.collider.center).reduce(collider.center),
            } as ColliderPositionTransformation;
        }
        return collider;
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
