import RandomMath from '../math/RandomMath';
import GameWorld from '../game-world-elements/GameWorld';
import { Vector2 } from '../game-object-types/Vector2';

export default class ScreenShaker {
    static shake(shakeIntensity: number = 20): void {
        const min: number = shakeIntensity - 1.5;
        const max: number = shakeIntensity + 1.5;
        const gameWorld: GameWorld = window.Camera.gameWorld;
        const s: Function = () =>
            ScreenShaker.moveScreen(gameWorld, RandomMath.randomNumber(min, max), RandomMath.randomNumber(min, max));
        s();
        setTimeout(s, 10);
        setTimeout(s, 20);

        setTimeout(() => {
            window.Camera.focusOnFollowing();
        }, 30);
    }

    static moveScreen(gameWorld: GameWorld, x: number, y: number): void {
        window.Camera.setPosition(gameWorld.position.add(new Vector2(x, y)));
    }
}
