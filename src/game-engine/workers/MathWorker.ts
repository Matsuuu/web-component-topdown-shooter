import '../math/VectorMath';
import VectorMath from '../math/VectorMath';

declare var self: Worker;

onmessage = message => {
    const mes = message.data as WorkerMessage;
    const mesData = mes.data;

    switch (mes.action) {
        case 'calculateHeading':
            self.postMessage({
                sourceEntity: mes.sourceEntity,
                result: VectorMath.calculateHeading(mesData.source, mesData.target),
            } as WorkerResponse);
            break;
        case 'calculateNextPosition':
            self.postMessage({
                sourceEntity: mes.sourceEntity,
                result: VectorMath.calculateNextPosition(
                    mesData.currentPosition,
                    mesData.heading,
                    mesData.movementSpeed,
                ),
            });
            break;
        case 'determineCrossPoint':
            self.postMessage({
                sourceEntity: mes.sourceEntity,
                result: VectorMath.determineCrossPoint(
                    mesData.lifeTime,
                    mesData.position,
                    mesData.heading,
                    mesData.movementSpeed,
                ),
            } as WorkerResponse);
            break;
    }
};
