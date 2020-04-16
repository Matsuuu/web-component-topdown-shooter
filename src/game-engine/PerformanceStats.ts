import Stats from 'stats-js/src/Stats';

export default class PerformanceStats {
    static _instance: PerformanceStats;

    stats: Stats;

    constructor() {
        PerformanceStats._instance = this;

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    static begin(): void {
        PerformanceStats._instance.stats.begin();
    }

    static end(): void {
        PerformanceStats._instance.stats.end();
    }
}

export const InitPerformanceStats = (): PerformanceStats => new PerformanceStats();
