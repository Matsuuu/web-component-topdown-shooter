export default abstract class CalculatorBase {
    workerPathBase: string = '/src/game-engine/workers/';
    calculations: Array<CalculationPromise> = [];
    abstract workerPath: string;
    worker: Worker;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queueMessage(sourceEntity: number): Promise<any> {
        return new Promise(resolve => {
            this.calculations.push({
                sourceEntity,
                resolve,
            });
        });
    }

    createWorker(): void {
        this.worker = new Worker(this.workerPathBase + this.workerPath, { type: 'module' });
        this.worker.onmessage = (message: MessageEvent): void => {
            const messageContent: WorkerResponse = message.data;
            // Get promise from list
            const calcPromise: Array<CalculationPromise> = this.calculations.splice(
                this.calculations.findIndex(calc => calc.sourceEntity === messageContent.sourceEntity),
                1,
            );

            // Resolve promise given at send message
            if (calcPromise.length > 0) {
                calcPromise.pop().resolve(messageContent.result);
            }
        };
    }
}
