import ColliderMath from '../math/ColliderMath';

declare var self: Worker;

onmessage = message => {
    const mes = message.data as WorkerMessage;
    const mesData = mes.data;

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
                result: ColliderMath.isCollidingWithStaticEntity(mesData.source, mesData.staticEntityColliders),
            } as WorkerResponse);
            break;
    }
};
