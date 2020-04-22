import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';
import './muzzles/BulletGunMuzzle';
import { MuzzleTypes } from './muzzles/MuzzleTypes';

export default class Pistol extends Weapon {
    damage: number = 1;
    projectileCount: number = 1;
    projectileSpeed: number = 800;
    coolDown: number = 500;
    knockBack: number = 2;

    constructor(owner) {
        super();
        this.initMuzzle(owner, MuzzleTypes.BulletGuMuzzle);
    }

    handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void {
        if (!this.canShoot) {
            return;
        }
        this.canShoot = false;
        ScreenShaker.shake(7);
        this.getProjectileHeading(shooterLocation, targetCoords, shooterId).then(heading => {
            this.spawnProjectile(shooterLocation, heading);
            this.handleMuzzle();
            this.handleCoolDown();
        });
    }
}
