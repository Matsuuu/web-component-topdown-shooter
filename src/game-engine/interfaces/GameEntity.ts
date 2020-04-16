interface GameEntity {
    entityId: number;
    tick(): void;
    addEntity(): void;
    removeEntity(): void;
}
