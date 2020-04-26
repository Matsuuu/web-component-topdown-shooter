import { getXBoundary, getYBoundary, InitBoundaries } from './apis/boundaries/Boundaries';
import PerformanceStats, { InitPerformanceStats } from './game-world-elements/PerformanceStats';
import Calculator from './apis/calculation/Calculator';
import './game-world-elements/EntityCounter';
import './game-world-elements/GameWorld';
import StaticEntity from './game-entities/StaticEntity';
import CollisionCalculator from './apis/calculation/CollisionCalculator';
import Collider from './game-object-types/Collider';
import RandomMath from './math/RandomMath';
import InitCamera, { CameraProperties } from './apis/camera/Camera';
import { GameEntity } from './interfaces/GameEntity';

const defaults: GameManagerParams = {
    tickRate: 64,
    gameWorld: document.body,
    gameWrapper: document.body,
    showStats: false,
};

declare global {
    interface Window {
        GameManager: GameManager;
    }
}

export interface GameManagerParams {
    gameWrapper: HTMLElement;
    gameWorld: ShadowRoot | HTMLElement;
    tickRate?: number;
    showStats?: boolean;
}

export default class GameManager {
    entities: Array<GameEntity>;
    staticEntities: Array<StaticEntity>;
    tickRate: number;
    tickDuration: number;
    gameWrapper: HTMLElement;
    gameWorld: ShadowRoot | HTMLElement;
    showStats: boolean;

    constructor(params?: GameManagerParams) {
        if (!params) {
            params = {} as GameManagerParams;
        }

        this.tickRate = params.tickRate || defaults.tickRate;
        this.tickDuration = 1 / this.tickRate;
        this.gameWrapper = params.gameWrapper || defaults.gameWrapper;
        this.gameWorld = params.gameWorld || defaults.gameWorld;
        this.showStats = params.showStats || defaults.showStats;
        this.entities = [];
        this.staticEntities = [];

        InitCamera({ gameWorld: this.gameWrapper } as CameraProperties);
        InitBoundaries();
        if (this.showStats) {
            InitPerformanceStats();
        }
        window.GameManager = this;
        this.initSingletonHelpers();
    }

    initSingletonHelpers() {
        new Calculator();
        new CollisionCalculator();
    }

    initStaticEntities() {
        window.CollisionCalculator.initStaticEntities();
    }

    startGame(): void {
        if (this.showStats) {
            setInterval(() => {
                this.handleGameTickWithStats();
            }, 1000 / this.tickRate);
        } else {
            setInterval(() => {
                this.handleGameTick();
            }, 1000 / this.tickRate);
        }
    }

    handleGameTickWithStats(): void {
        PerformanceStats.begin();
        this.entities.forEach(entity => {
            entity.tick();
        });
        PerformanceStats.end();
    }

    handleGameTick(): void {
        this.getEnabledEntities().forEach(entity => {
            entity.tick();
        });
    }

    getEnabledEntities(): Array<GameEntity> {
        return this.entities.filter(ent => ent.enabled);
    }

    addGameEntity(entity: GameEntity): number {
        entity.entityId = Date.now() + RandomMath.randomNumber(100, 999);
        this.entities.push(entity);
        // Return ID for removal purposes
        return entity.entityId;
    }

    removeGameEntity(id: number): void {
        this.entities = this.entities.filter(ent => ent.entityId !== id);
    }

    spawnEntity(elem: HTMLElement) {
        this.gameWorld.appendChild(elem);
    }

    addStaticEntity(entity: StaticEntity): number {
        entity.entityId = Date.now() + RandomMath.randomNumber(100, 999);
        this.staticEntities.push(entity);
        this.initStaticEntities();
        // Return ID for removal purposes
        return entity.entityId;
    }

    getStaticEntities(): Array<StaticEntity> {
        return this.staticEntities;
    }

    getStaticEntityColliders(): Array<Collider> {
        return this.staticEntities.map(entity => entity.getCollider());
    }

    getStaticEntityBoundingRects(): Array<DOMRect> {
        return this.staticEntities.map(entity => entity.getBoundingClientRect());
    }

    getAllEntities(): Array<GameEntity> {
        return [...(this.staticEntities as Array<GameEntity>), ...(this.entities as Array<GameEntity>)];
    }
}
