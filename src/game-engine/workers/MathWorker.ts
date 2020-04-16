import '../math/VectorMath';
import VectorMath from '../math/VectorMath';

declare var self: Worker;

onmessage = message => {
    const messageContent = message.data as MathWorkerMessage;

    switch (messageContent.action) {
        case 'calculateHeading':
            returnCalculatedHeading(messageContent);
            break;
        case 'calculateNextPosition':
            returnCalculatedNextPosition(messageContent);
            break;
    }
};

const returnCalculatedHeading = (messageContent: MathWorkerMessage) => {
    self.postMessage({
        sourceEntity: messageContent.sourceEntity,
        result: VectorMath.calculateHeading(messageContent.data.source, messageContent.data.target),
    } as MathWorkerResponse);
};

const returnCalculatedNextPosition = (messageContent: MathWorkerMessage) => {
    self.postMessage({
        sourceEntity: messageContent.sourceEntity,
        result: VectorMath.calculateNextPosition(
            messageContent.data.currentPosition,
            messageContent.data.heading,
            messageContent.data.movementSpeed,
        ),
    });
};
