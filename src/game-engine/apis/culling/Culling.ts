import { GameEntity } from '../../interfaces/GameEntity';
import BoundaryMath from '../../math/BoundaryMath';

export default class Culling {
    static checkCulling(allEntities?: Array<GameEntity>): void {
        if (!allEntities) {
            allEntities = window.GameManager.getAllEntities();
        }
        allEntities.map(entity => {
            entity.enabled = BoundaryMath.isInsideWindow(entity.getCollider(), 150);
        });
    }
}
