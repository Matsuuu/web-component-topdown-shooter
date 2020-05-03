import { Vector2 } from './Vector2';

export default class Collider {
    drawCollider: boolean = false;

    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    localCenter: Vector2;
    center: Vector2;

    constructor(domRect: DOMRect) {
        this.left = domRect.left;
        this.top = domRect.top;
        this.right = domRect.right;
        this.bottom = domRect.bottom;
        this.width = domRect.width;
        this.height = domRect.height;
        this.localCenter = new Vector2(domRect.width / 2, domRect.height / 2);
        this.center = new Vector2(this.left + this.localCenter.x, this.top + this.localCenter.y);
    }

    toggleColliderDrawing(on: boolean): void {
        this.drawCollider = on;
    }
}
