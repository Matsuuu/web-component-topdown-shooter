import { Vector2 } from '../../game-object-types/Vector2';
import CalculatorBase from './CalculatorBase';

declare global {
    interface Window {
        Calculator: Calculator;
    }
}

export default class Calculator extends CalculatorBase {
    workerPath: string = 'MathWorker.ts';

    constructor() {
        super();
        this.createWorker();
        window.Calculator = this;
    }

    calculateHeading(source: Vector2, target: Vector2, sourceEntity: number): Promise<Vector2> {
        this.worker.postMessage({
            sourceEntity,
            action: 'calculateHeading',
            data: { source, target },
        } as WorkerMessage);
        return this.queueMessage(sourceEntity);
    }

    calculateNextPosition(
        currentPosition: Vector2,
        heading: Vector2,
        movementSpeed: number,
        sourceEntity: number,
    ): Promise<Vector2> {
        this.worker.postMessage({
            sourceEntity,
            action: 'calculateNextPosition',
            data: { currentPosition, heading, movementSpeed },
        });
        return this.queueMessage(sourceEntity);
    }

    getProjectileTarget(
        lifeTime: number,
        position: Vector2,
        heading: Vector2,
        movementSpeed: number,
        sourceEntity: number,
    ): Promise<Vector2> {
        this.worker.postMessage({
            sourceEntity,
            action: 'determineCrossPoint',
            data: { lifeTime, position, heading, movementSpeed },
        });
        return this.queueMessage(sourceEntity);
    }
}
