import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';
import RandomMath from '../../game-engine/math/RandomMath';

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
            heading = this.offsetHeading(heading);
            this.spawnProjectile(shooterLocation, heading);
            this.handleCoolDown();
        });
    }

    /**
     * It's an smg. It should have some spray pattern
     * @param heading
     */
    offsetHeading(heading: Vector2): Vector2 {
        // Determine which axis the spray should affect
        if (Number.isInteger(heading.x)) {
            heading.y += RandomMath.randomBetweenOneAndMinusOne() * 0.05;
        } else {
            heading.x += RandomMath.randomBetweenOneAndMinusOne() * 0.05;
        }
        return heading;
    }
}
