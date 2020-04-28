import GameWorld from '../../game-world-elements/GameWorld';
import { Vector2 } from '../../game-object-types/Vector2';
import { LitEntity } from '../../game-entities/LitEntity';
import Culling from '../culling/Culling';

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
    following: LitEntity;
    followingInterval: NodeJS.Timeout;

    halfWindowSize: Vector2;

    constructor(props: CameraProperties) {
        if (!props.gameWorld) {
            throw new Error('Camera needs a gameworld object attached to function.');
        }
        this.halfWindowSize = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
        this.gameWorld = props.gameWorld;
        window.addEventListener('keydown', e => {
            if (cameraMovementKeys.includes(e.key)) {
                switch (e.key) {
                    case 'ArrowDown':
                        this.transitionTo(this.gameWorld.position.reduce(new Vector2(0, 50)));
                        break;
                    case 'ArrowUp':
                        this.transitionTo(this.gameWorld.position.reduce(new Vector2(0, -50)));
                        break;
                    case 'ArrowRight':
                        this.transitionTo(this.gameWorld.position.reduce(new Vector2(50, 0)));
                        break;
                    case 'ArrowLeft':
                        this.transitionTo(this.gameWorld.position.reduce(new Vector2(-50, 0)));
                        break;
                }
            }
        });

        window.Camera = this;
    }

    getRelativeMousePosition(mousePosition: Vector2): Vector2 {
        return mousePosition
            .add(window.Camera.getPosition())
            .add(new Vector2(0, window.innerHeight))
            .reverse();
    }

    follow(entity: LitEntity): void {
        if (this.followingInterval) {
            clearInterval(this.followingInterval);
        }
        this.following = entity;
        this.followingInterval = setInterval(() => {
            this.focusOnFollowing();
        }, 90);
    }

    focusOnFollowing(): void {
        const followingObjectPosition: Vector2 = new Vector2(
            this.following.position.x,
            this.following.position.y,
        ).reverse();
        followingObjectPosition.reduce(new Vector2(-this.halfWindowSize.x, this.halfWindowSize.y));
        if (!this.getPosition().equals(followingObjectPosition)) {
            this.transitionTo(followingObjectPosition);
        }
    }

    getPosition(): Vector2 {
        return this.gameWorld.position;
    }

    setPosition(newPosition: Vector2): void {
        this.gameWorld.setPosition(newPosition);
    }

    transitionTo(newPosition: Vector2, transitionSpeed: number = 100): void {
        Culling.checkCulling();
        this.gameWorld.transitionTo(newPosition, transitionSpeed);
    }
}

const InitCamera: Function = (props: CameraProperties) => new Camera(props);

export default InitCamera;
