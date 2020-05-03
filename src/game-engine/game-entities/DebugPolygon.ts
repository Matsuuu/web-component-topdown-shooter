import { css, customElement, html, LitElement, property } from 'lit-element';
import { Vector2 } from '../game-object-types/Vector2';
import Collider from '../game-object-types/Collider';

@customElement('debug-polygon')
export class DebugPolygon extends LitElement {
    @property({ type: Vector2 })
    size: Vector2;
    @property({ type: Array })
    points: Array<Vector2>;

    static get styles() {
        return css`
            :host {
                position: absolute;
                bottom: 0;
                left: 0;
            }
        `;
    }

    render() {
        return html``;
    }
}

export function DrawDebugPolygon(size: Vector2, points: Array<Vector2>): DebugPolygon {
    const poly: DebugPolygon = document.createElement('debug-polygon') as DebugPolygon;
    poly.size = size;
    poly.points = points;
    return poly;
}

export function DrawCollider(collider: Collider): DebugPolygon {
    const poly: DebugPolygon = document.createElement('debug-polygon') as DebugPolygon;
    poly.size = new Vector2(collider.width, collider.height);
    poly.points = [
        new Vector2(collider.left, collider.top),
        new Vector2(collider.top, collider.right),
        new Vector2(collider.right, collider.bottom),
        new Vector2(collider.bottom, collider.left),
    ];
    return poly;
}
