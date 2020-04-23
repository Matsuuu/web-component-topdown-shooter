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

    reverse(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    add(other: Vector2): Vector2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    reduce(other: Vector2): Vector2 {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    multiply(multiplier: number): Vector2 {
        this.x *= multiplier;
        this.y *= multiplier;
        return this;
    }
}
