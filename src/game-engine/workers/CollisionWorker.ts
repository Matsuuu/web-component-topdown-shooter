import ColliderMath from '../math/ColliderMath';
import { Vector2 } from '../game-object-types/Vector2';
import Collider from '../game-object-types/Collider';

declare const self: Worker;

let staticEntityColliders: Array<Collider> = [];

const getStaticEntityColliders: Function = (): Array<Collider> => {
    return staticEntityColliders;
};

onmessage = (message: MessageEvent): void => {
    const mes: WorkerMessage = message.data as WorkerMessage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mesData: any = mes.data;

    switch (mes.action) {
        case 'isColliding':
            self.postMessage({
                sourceEntity: mes.sourceEntity,
                result: ColliderMath.isColliding(mesData.source, mesData.target),
            } as WorkerResponse);
            break;
        case 'isCollidingWithStaticEntity':
            self.postMessage({
                sourceEntity: mes.sourceEntity,
                result: ColliderMath.isCollidingWithStaticEntity(mesData.source, getStaticEntityColliders()),
            } as WorkerResponse);
            break;
        case 'staticEntityList':
            staticEntityColliders = mesData.staticEntityColliders;
            break;
    }
};
