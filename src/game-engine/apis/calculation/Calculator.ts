import { Vector2 } from '../../game-object-types/Vector2';
import CalculatorBase from './CalculatorBase';
import Collider from '../../game-object-types/Collider';

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

    calculateNextColliderPosition(
        currentPosition: Vector2,
        heading: Vector2,
        movementSpeed: number,
        size: Vector2,
        rotation: number,
        lifetimeElapsed: number,
        sourceEntity: number,
    ): Promise<Collider> {
        this.worker.postMessage({
            sourceEntity,
            action: 'calculateNextColliderPosition',
            data: { currentPosition, heading, movementSpeed, size, rotation, lifetimeElapsed },
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
