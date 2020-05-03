import { InitBoundaries } from './apis/boundaries/Boundaries';
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
import WaitUtil from './apis/wait/WaitUtil';
import './game-world-elements/DebugOptions';
import './game-world-elements/DebugOverlay';

const defaults: GameManagerParams = {
    tickRate: 64,
    gameWorld: document.body,
    gameWrapper: document.body,
    showStats: false,
    debug: false,
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
    debug?: boolean;
}

export default class GameManager {
    entities: Array<GameEntity>;
    staticEntities: Array<StaticEntity>;
    tickRate: number;
    tickDuration: number;
    tickDurationMs: number;
    gameWrapper: HTMLElement;
    gameWorld: ShadowRoot | HTMLElement;
    showStats: boolean;
    debug: boolean;
    ticks: number = 0;
    queuedEntities: Array<HTMLElement> = [];

    constructor(params?: GameManagerParams) {
        if (!params) {
            params = {} as GameManagerParams;
        }

        this.tickRate = params.tickRate || defaults.tickRate;
        this.tickDuration = 1 / this.tickRate;
        this.tickDurationMs = 1000 / this.tickRate;
        this.gameWrapper = params.gameWrapper || defaults.gameWrapper;
        this.gameWorld = params.gameWorld || defaults.gameWorld;
        this.showStats = params.showStats || defaults.showStats;
        this.debug = params.debug || false;
        this.entities = [];
        this.staticEntities = [];

        InitCamera({ gameWorld: this.gameWrapper } as CameraProperties);
        InitBoundaries();
        if (this.showStats) {
            InitPerformanceStats();
        }
        window.GameManager = this;
        this.initDebugOptions();
        this.initSingletonHelpers();
    }

    initDebugOptions(): void {
        const debugOptions: HTMLElement = document.createElement('debug-options');
        document.body.appendChild(debugOptions);
        const debugOverlay: HTMLElement = document.createElement('debug-overlay');
        document.body.appendChild(debugOverlay);
    }

    initSingletonHelpers(): void {
        new Calculator();
        new CollisionCalculator();
    }

    initStaticEntities(): void {
        window.CollisionCalculator.initStaticEntities();
    }

    startGame(): void {
        if (this.showStats) {
            this.handleGameTickWithStats();
        } else {
            this.handleGameTick();
        }
    }

    async handleGameTickWithStats(): Promise<void> {
        PerformanceStats.begin();
        this.ticks++;
        this.entities.forEach(entity => {
            entity.tick();
        });
        this.spawnQueuedEntities();
        PerformanceStats.end();
        await WaitUtil.wait(this.tickDurationMs);
        this.handleGameTickWithStats();
    }

    async handleGameTick(): Promise<void> {
        const startOfTick: number = Date.now();

        this.ticks++;
        this.getEnabledEntities().forEach(entity => {
            entity.tick();
        });
        this.spawnQueuedEntities();

        const tickDuration: number = Date.now() - startOfTick;
        await WaitUtil.wait(this.tickDurationMs - tickDuration);
        this.handleGameTick();
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

    /**
     * Queue entity for spawning. Spawning is done in one sweep to reduce DOM load
     * @param elem
     */
    spawnEntity(elem: HTMLElement): void {
        this.queuedEntities.push(elem);
    }

    /**
     * Spawn items queued by the spawnEntity method
     */
    spawnQueuedEntities(): void {
        if (this.queuedEntities.length < 1) {
            return;
        }
        const frag: DocumentFragment = document.createDocumentFragment();
        this.queuedEntities.forEach(ent => {
            frag.appendChild(ent);
        });
        this.queuedEntities = [];
        this.gameWorld.appendChild(frag);
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
