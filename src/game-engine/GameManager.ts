import { InitBoundaries } from './Boundaries';
import PerformanceStats, { InitPerformanceStats } from './PerformanceStats';
import Calculator from './Calculator';
import './EntityCounter';

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
        InitBoundaries();
        if (this.showStats) {
            InitPerformanceStats();
        }
        new Calculator();
        window.GameManager = this;
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
        this.entities.forEach(entity => {
            entity.tick();
        });
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
        this.gameWorld.appendChild(elem);
    }
}
