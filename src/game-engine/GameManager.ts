import { InitBoundaries } from './Boundaries';
import PerformanceStats, { InitPerformanceStats } from './PerformanceStats';
import Calculator from './Calculator';

const defaults: GameManagerParams = {
    tickRate: 64,
    gameWorld: document.body,
};

declare global {
    interface Window {
        GameManager: GameManager;
    }
}

export interface GameManagerParams {
    tickRate?: number;
    gameWorld: HTMLElement;
}

export default class GameManager {
    entities: Array<GameEntity>;
    tickRate: number;
    gameWorld: HTMLElement;

    constructor(params?: GameManagerParams) {
        if (!params) {
            params = {} as GameManagerParams;
        }

        this.tickRate = params.tickRate || defaults.tickRate;
        this.gameWorld = params.gameWorld || defaults.gameWorld;
        this.entities = [];
        InitBoundaries();
        InitPerformanceStats();
        new Calculator();
        window.GameManager = this;
    }

    startGame(): void {
        setInterval(() => {
            this.handleGameTick();
        }, 1000 / this.tickRate);
    }

    handleGameTick(): void {
        PerformanceStats.begin();
        this.entities.forEach(entity => {
            entity.tick();
        });
        PerformanceStats.end();
    }

    addGameEntity(entity: GameEntity): number {
        entity.entityId = Date.now();
        this.entities.push(entity);
        // Return ID for removal purpouses
        return entity.entityId;
    }

    removeGameEntity(id: number): void {
        this.entities = this.entities.filter(ent => ent.entityId !== id);
    }

    spawnEntity(elem: HTMLElement) {
        this.gameWorld.shadowRoot.appendChild(elem);
    }
}
