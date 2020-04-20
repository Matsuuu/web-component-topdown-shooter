import RandomMath from '../math/RandomMath';

export class Vector2 {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static random() {
        return new Vector2(
            RandomMath.randomBetweenOneAndMinusOne().toFixed(2),
            RandomMath.randomBetweenOneAndMinusOne().toFixed(2),
        );
    }
}
