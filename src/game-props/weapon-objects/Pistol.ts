import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';

export default class Pistol extends Weapon {
    damage: number = 1;
    projectileCount: number = 1;
    projectileSpeed: number = 800;
    canShoot: boolean = true;
    coolDown: number = 500;

    handleShoot(shooterLocation: Vector2, targetCoords: Vector2, shooterId: number): void {
        if (!this.canShoot) {
            return;
        }
        this.canShoot = false;
        ScreenShaker.shake(7);
        this.getProjectileHeading(shooterLocation, targetCoords, shooterId).then(heading => {
            this.spawnProjectile(shooterLocation, heading);
            this.handleCoolDown();
        });
    }
}
