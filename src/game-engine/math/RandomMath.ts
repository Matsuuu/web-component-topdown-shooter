export default class RandomMath {
    static randomBetweenOneAndMinusOne(): number {
        return Math.random() * (Math.random() > 0.5 ? -1 : 1);
    }

    static randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * max) + min;
    }
}
