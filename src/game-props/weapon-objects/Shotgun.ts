import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';
import './muzzles/BulletGunMuzzle';
import { MuzzleTypes } from './muzzles/MuzzleTypes';

export default class Shotgun extends Weapon {
    damage: number = 0.5;
    projectileCount: number = 8;
    projectileSpeed: number = 800;
    coolDown: number = 1500;
    knockBack: number = 20;

    constructor(owner) {
        super();
        this.initMuzzle(owner, MuzzleTypes.BulletGuMuzzle);
    }

    handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void {
        if (!this.canShoot) {
            return;
        }
        this.canShoot = false;
        ScreenShaker.shake(15);
        window.Calculator.calculateHeading(shooterLocation, targetCoords, shooterId).then(heading => {
            const spreadByXAxis = Number.isInteger(heading.y);
            if (spreadByXAxis) {
                heading.x -= 0.08;
            } else {
                heading.y -= 0.08;
            }
            for (let i = 0; i < this.projectileCount; i++) {
                this.spawnProjectile(shooterLocation, { ...heading } as Vector2);
                if (spreadByXAxis) {
                    heading.x += 0.02;
                } else {
                    heading.y += 0.02;
                }
            }
            this.handleMuzzle();
            this.handleCoolDown();
        });
    }
}
