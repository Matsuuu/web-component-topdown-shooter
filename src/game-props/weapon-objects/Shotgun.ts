import Weapon from '../base/Weapon';
import { Vector2 } from '../../game-engine/game-object-types/Vector2';
import PlayerProjectile from '../player-objects/PlayerProjectile';
import ScreenShaker from '../../game-engine/juice/ScreenShaker';

export default class Shotgun extends Weapon {
    damage: number = 0.5;
    projectileCount: number = 8;
    projectileSpeed: number = 800;
    canShoot: boolean = true;
    coolDown: number = 1500;

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
                this.spawnProjectile(shooterLocation, { ...heading });
                if (spreadByXAxis) {
                    heading.x += 0.02;
                } else {
                    heading.y += 0.02;
                }
            }
            this.handleCoolDown();
        });
    }
}
