export default class WaitUtil {
    static wait(timeoutMs: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, timeoutMs);
        });
    }
}
