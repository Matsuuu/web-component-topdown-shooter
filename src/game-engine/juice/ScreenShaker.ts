import RandomMath from '../math/RandomMath';

export default class ScreenShaker {
    static shake(shakeIntensity: number = 20) {
        const min = shakeIntensity - 2.5;
        const max = shakeIntensity + 2.5;
        const gameWorld = window.GameManager.gameWrapper;
        const s: Function = () =>
            ScreenShaker.moveScreen(gameWorld, RandomMath.randomNumber(min, max), RandomMath.randomNumber(min, max));
        s();
        setTimeout(s, 10);
        setTimeout(s, 20);
        setTimeout(s, 30);

        setTimeout(() => {
            ScreenShaker.moveScreen(gameWorld, 0, 0);
        }, 40);
    }

    static moveScreen(gameWorld: HTMLElement, x: number, y: number) {
        gameWorld.style.transform = `translate(${x}px, ${y}px)`;
    }
}
