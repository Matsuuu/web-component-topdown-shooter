import CalculatorBase from './CalculatorBase';
import Collider from '../../game-object-types/Collider';

declare global {
    interface Window {
        CollisionCalculator: CollisionCalculator;
    }
}

export default class CollisionCalculator extends CalculatorBase {
    workerPath: string = 'CollisionWorker.ts';

    constructor() {
        super();
        this.createWorker();
        window.CollisionCalculator = this;
        this.initStaticEntities();
    }

    initStaticEntities(): void {
        this.worker.postMessage({
            action: 'staticEntityList',
            data: { staticEntityColliders: window.GameManager.getStaticEntityColliders() },
        });
    }

    isColliding(source: Collider, target: Collider, sourceEntity: number): Promise<boolean> {
        this.worker.postMessage({
            sourceEntity,
            action: 'isColliding',
            data: { source, target },
        });
        return this.queueMessage(sourceEntity);
    }

    isCollidingWithStaticEntity(source: Collider, sourceEntity: number): Promise<boolean> {
        this.worker.postMessage({
            sourceEntity,
            action: 'isCollidingWithStaticEntity',
            data: { source },
        });
        return this.queueMessage(sourceEntity);
    }
}
