import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import PlayerProjectile from '../player-objects/PlayerProjectile';
import BulletGunMuzzle from '../weapon-objects/muzzles/BulletGunMuzzle';
import Muzzle from '../weapon-objects/muzzles/Muzzle';
import { LitEntity } from '../../game-engine/game-entities/LitEntity';
import { MuzzleTypes } from '../weapon-objects/muzzles/MuzzleTypes';

export default abstract class Weapon {
    abstract coolDown: number;
    abstract projectileCount: number;
    abstract projectileSpeed: number;
    abstract damage: number;
    abstract knockBack: number;
    canShoot: boolean = true;
    muzzle: Muzzle;

    abstract handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void;

    protected spawnProjectile(spawnLocation: Vector2, heading: Vector2): void {
        const projectile = document.createElement('player-projectile') as PlayerProjectile;
        projectile.position = spawnLocation;
        projectile.movementSpeed = this.projectileSpeed / window.GameManager.tickRate;
        projectile.heading = heading;
        projectile.damage = this.damage;
        projectile.knockBack = this.knockBack;
        window.GameManager.spawnEntity(projectile);
    }

    protected adjustShooterLocation(shooterLocation: Vector2, heading: Vector2, adjustAmount: number = 20) {
        shooterLocation.x += heading.x * adjustAmount;
        shooterLocation.y += heading.y * adjustAmount;
        return shooterLocation;
    }

    protected handleCoolDown(): void {
        setTimeout(() => (this.canShoot = true), this.coolDown);
    }

    protected getProjectileHeading(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number) {
        return window.Calculator.calculateHeading(shooterLocation, targetCoords, shooterId);
    }

    protected handleMuzzle() {
        this.muzzle.classList.add('flash');
        setTimeout(() => {
            this.muzzle.classList.remove('flash');
        }, 100);
    }

    protected initMuzzle(owner: LitEntity, muzzleType: MuzzleTypes) {
        this.muzzle = document.createElement(muzzleType) as Muzzle;
        owner.shadowRoot.appendChild(this.muzzle);
    }
}
