export default class CollisionEvent {
    target: GameEntity;
    source: GameEntity;

    constructor(target: GameEntity, source: GameEntity) {
        this.target = target;
        this.source = source;
    }
}
