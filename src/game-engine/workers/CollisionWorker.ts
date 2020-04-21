import ColliderMath from '../math/ColliderMath';

declare var self: Worker;

let staticEntityColliders = [];

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
                result: ColliderMath.isCollidingWithStaticEntity(mesData.source, staticEntityColliders),
            } as WorkerResponse);
            break;
        case 'staticEntityList':
            staticEntityColliders = mesData.staticEntityColliders;
            console.log('Set static entities', staticEntityColliders);
            break;
    }
};
