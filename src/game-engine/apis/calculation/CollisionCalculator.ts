import CalculatorBase from './CalculatorBase';
import Collider from '../../game-object-types/Collider';
import { Vector2 } from '../../game-object-types/Vector2';

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
        setTimeout(() => {
            this.initStaticEntities();
        }, 1000);
    }

    initStaticEntities(): void {
        Promise.all(window.GameManager.getStaticEntityColliders()).then((staticEntityColliders: Array<Collider>) => {
            this.worker.postMessage({
                action: 'staticEntityList',
                data: { staticEntityColliders },
            });
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

    getCollider(position: Vector2, size: Vector2, rotation: number, sourceEntity: number): Promise<Collider> {
        this.worker.postMessage({
            sourceEntity,
            action: 'getCollider',
            data: { position, size, rotation },
        });
        return this.queueMessage(sourceEntity);
    }
}
