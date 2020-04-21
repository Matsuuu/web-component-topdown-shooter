import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';
import { MuzzleTypes } from './muzzles/MuzzleTypes';
import './muzzles/BulletGunMuzzle';

export default class TripleMachineGun extends Weapon {
    coolDown: number = 50;
    damage: number = 0.3;
    projectileCount: number = 3;
    projectileSpeed: number = 800;

    projectileOffset: number = 0.15;

    constructor(owner) {
        super();
        this.initMuzzle(owner, MuzzleTypes.BulletGuMuzzle);
    }

    handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void {
        if (!this.canShoot) {
            return;
        }
        this.canShoot = false;
        ScreenShaker.shake(2.5);
        this.getProjectileHeading(shooterLocation, targetCoords, shooterId).then(heading => {
            const headings: Array<Vector2> = this.getBulletHeadings(heading);
            for (let i: number = 0; i < 3; i++) {
                this.spawnProjectile(shooterLocation, headings[i]);
                this.handleMuzzle();
                this.handleCoolDown();
            }
        });
    }

    getBulletHeadings(heading: Vector2): Array<Vector2> {
        // Determine which axis the spray should affect
        if (Number.isInteger(heading.y)) {
            return [
                heading,
                new Vector2(heading.x - this.projectileOffset, heading.y),
                new Vector2(heading.x + this.projectileOffset, heading.y),
            ];
        } else {
            return [
                heading,
                new Vector2(heading.x, heading.y - this.projectileOffset),
                new Vector2(heading.x, heading.y + this.projectileOffset),
            ];
        }
    }
}
