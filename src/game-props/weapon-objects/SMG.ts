import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';

export default class SMG extends Weapon {
    damage: number = 0.3;
    projectileCount: number = 1;
    projectileSpeed: number = 600;
    canShoot: boolean = true;
    coolDown: number = 100;

    handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void {
        if (!this.canShoot) {
            return;
        }
        this.canShoot = false;
        ScreenShaker.shake(4);
        this.getProjectileHeading(shooterLocation, targetCoords, shooterId).then(heading => {
            this.spawnProjectile(shooterLocation, heading);
            this.handleCoolDown();
        });
    }
}
