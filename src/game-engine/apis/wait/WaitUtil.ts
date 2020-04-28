export default class WaitUtil {
    static wait(timeoutMs: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeoutMs);
        });
    }
}
