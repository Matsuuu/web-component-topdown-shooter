export default class RandomMath {
    static randomBetweenOneAndTwo() {
        return Math.random() * (Math.random() > 0.5 ? -1 : 1);
    }
}
