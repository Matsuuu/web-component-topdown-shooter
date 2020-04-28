import ColliderMath from '../math/ColliderMath';
import { Vector2 } from '../game-object-types/Vector2';
import Collider from '../game-object-types/Collider';

declare const self: Worker;

let staticEntityBoundingRects: Array<DOMRect> = [];

const getStaticEntityColliders: Function = (cameraPosition: Vector2): Array<Collider> => {
    return staticEntityBoundingRects.map(boundingRect => {
        const relativeDomRect: DOMRect = new DOMRect(
            boundingRect.x + cameraPosition.x - 10,
            boundingRect.y + cameraPosition.y - 20,
            boundingRect.width,
            boundingRect.height,
        );
        return new Collider(relativeDomRect);
    });
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
                result: ColliderMath.isCollidingWithStaticEntity(
                    mesData.source,
                    getStaticEntityColliders(mesData.cameraPosition as Vector2),
                ),
            } as WorkerResponse);
            break;
        case 'staticEntityList':
            staticEntityBoundingRects = mesData.staticEntityBoundingRects;
            break;
    }
};
