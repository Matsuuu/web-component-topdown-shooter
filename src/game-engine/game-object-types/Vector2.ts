import RandomMath from '../math/RandomMath';

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static random(): Vector2 {
        return new Vector2(
            Number.parseInt(RandomMath.randomBetweenOneAndMinusOne().toFixed(2)),
            Number.parseInt(RandomMath.randomBetweenOneAndMinusOne().toFixed(2)),
        );
    }

    equals(other: Vector2): boolean {
        if (!other) {
            return false;
        }
        return other.x === this.x && other.y === this.y;
    }

    reverse(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
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

    static from(coords: { x: number; y: number }): Vector2 {
        return new Vector2(coords.x, coords.y);
    }
}
