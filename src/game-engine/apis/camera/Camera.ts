import GameWorld from '../../game-world-elements/GameWorld';
import { Vector2 } from '../../game-object-types/Vector2';

export interface CameraProperties {
    gameWorld: GameWorld;
}

declare global {
    interface Window {
        Camera: Camera;
    }
}

const cameraMovementKeys: Array<string> = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

export class Camera {
    gameWorld: GameWorld;

    constructor(props: CameraProperties) {
        if (!props.gameWorld) {
            throw new Error('Camera needs a gameworld object attached to function.');
        }
        this.gameWorld = props.gameWorld;
        window.addEventListener('keydown', e => {
            if (cameraMovementKeys.includes(e.key)) {
                switch (e.key) {
                    case 'ArrowDown':
                        this.setPosition(this.gameWorld.position.reduce(new Vector2(0, 50)));
                        break;
                    case 'ArrowUp':
                        this.setPosition(this.gameWorld.position.reduce(new Vector2(0, -50)));
                        break;
                    case 'ArrowRight':
                        this.setPosition(this.gameWorld.position.reduce(new Vector2(50, 0)));
                        break;
                    case 'ArrowLeft':
                        this.setPosition(this.gameWorld.position.reduce(new Vector2(-50, 0)));
                        break;
                }
            }
        });

        window.Camera = this;
    }

    getPosition(): Vector2 {
        return this.gameWorld.position;
    }

    setPosition(newPosition: Vector2): void {
        this.gameWorld.setPosition(newPosition);
        console.log(this.gameWorld.position);
    }

    transitionTo(newPosition: Vector2): void {
        this.gameWorld.transitionTo(newPosition);
    }
}

const InitCamera = (props: CameraProperties) => new Camera(props);

export default InitCamera;
