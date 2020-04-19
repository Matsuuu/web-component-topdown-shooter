import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import PlayerProjectile from '../player-objects/PlayerProjectile';

export default abstract class Weapon {
    coolDown: number;
    projectileCount: number;
    projectileSpeed: number;
    damage: number;
    canShoot: boolean;

    abstract handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void;

    protected spawnProjectile(spawnLocation: Vector2, heading: Vector2): void {
        const projectile = document.createElement('player-projectile') as PlayerProjectile;
        projectile.position = spawnLocation;
        projectile.movementSpeed = this.projectileSpeed / window.GameManager.tickRate;
        projectile.heading = heading;
        projectile.damage = this.damage;
        window.GameManager.spawnEntity(projectile);
    }

    protected handleCoolDown(): void {
        setTimeout(() => (this.canShoot = true), this.coolDown);
    }

    protected getProjectileHeading(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number) {
        return window.Calculator.calculateHeading(shooterLocation, targetCoords, shooterId);
    }
}
