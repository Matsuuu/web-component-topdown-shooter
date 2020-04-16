import { Vector2 } from './game-object-types/Vector2';

declare global {
    interface Window {
        Calculator: Calculator;
    }
}

interface CalculationPromise {
    sourceEntity: number;
    resolve: Function;
}

export default class Calculator {
    mathWorker: Worker;
    calculations: Array<CalculationPromise> = [];

    constructor() {
        for (let i = 0; i < 20; i++) {
            this.createMathWorker();
        }
        window.Calculator = this;
    }

    createMathWorker() {
        this.mathWorker = new Worker('/src/game-engine/workers/MathWorker.ts', { type: 'module' });
        this.mathWorker.onmessage = message => {
            const messageContent: MathWorkerResponse = message.data;
            // Get promise from list
            let calcPromise = this.calculations.splice(
                this.calculations.findIndex(calc => calc.sourceEntity === messageContent.sourceEntity),
                1,
            );

            // Resolve promise given at send message
            if (calcPromise.length > 0) {
                calcPromise.pop().resolve(messageContent.result);
            }
        };
    }

    async calculateHeading(source: Vector2, target: Vector2, sourceEntity: number): Promise<Vector2> {
        this.mathWorker.postMessage({
            sourceEntity,
            action: 'calculateHeading',
            data: { source, target },
        } as MathWorkerMessage);
        return new Promise(resolve => {
            this.calculations.push({
                sourceEntity,
                resolve,
            });
        });
    }

    async calculateNextPosition(
        currentPosition: Vector2,
        heading: Vector2,
        movementSpeed: number,
        sourceEntity: number,
    ) {
        this.mathWorker.postMessage({
            sourceEntity,
            action: 'calculateNextPosition',
            data: { currentPosition, heading, movementSpeed },
        });
        return new Promise(resolve => {
            this.calculations.push({
                sourceEntity,
                resolve,
            });
        });
    }
}
