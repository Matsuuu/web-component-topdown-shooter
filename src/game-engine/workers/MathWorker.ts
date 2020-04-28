import '../math/VectorMath';
import VectorMath from '../math/VectorMath';

declare const self: Worker;

onmessage = (message: MessageEvent): void => {
    const mes: WorkerMessage = message.data as WorkerMessage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mesData: any = mes.data;

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
