import { css, CSSResult, customElement, html, LitElement, property } from 'lit-element';
import Collider from '../game-object-types/Collider';
import { Vector2 } from '../game-object-types/Vector2';
import { GameEntity } from '../interfaces/GameEntity';
import { debugSettingsChangedEvent } from './DebugOptions';

@customElement('debug-overlay')
export default class DebugOverlay extends LitElement {
    @property({ type: Boolean })
    showColliders: boolean = false;
    showCollidersInterval: NodeJS.Timeout;

    static get styles(): CSSResult {
        return css`
            :host {
                height: 100%;
                width: 100%;
                bottom: 0;
                left: 0;
                position: absolute;
                z-index: ;
            }
        `;
    }

    updateColliders() {
        this.drawColliders(window.GameManager.getAllEntities());
    }

    protected firstUpdated(): void {
        window.addEventListener(debugSettingsChangedEvent, (e: CustomEvent) => {
            if (e.detail.key === 'showColliders') {
                this.toggleShowColliders(e.detail.value);
            }
        });
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 't') {
                this.updateColliders();
            }
        });
        setTimeout(() => {
            this.toggleShowColliders(window.DebugOptions.getOption('showColliders'));
        }, 100);
    }

    toggleShowColliders(on: boolean) {
        this.showColliders = on;
        if (this.showColliders) {
            this.updateColliders();

            console.log(window.GameManager.tickDurationMs);
            this.showCollidersInterval = setInterval(() => {
                this.updateColliders();
            }, window.GameManager.tickDurationMs);
        } else {
            clearTimeout(this.showCollidersInterval);
            this.emptyColliderSvg();
        }
    }

    drawColliders(entities: Array<GameEntity>): void {
        const elem: SVGSVGElement = this.shadowRoot.querySelector('#colliders');
        const gameWorldSize: Vector2 = window.GameManager.gameWorld.size;
        const frag: DocumentFragment = document.createDocumentFragment();
        const colliderPromises: Array<Promise<Collider>> = entities.map(ent => ent.getCollider());
        Promise.all(colliderPromises).then((colliders: Array<Collider>) => {
            colliders.map(col => {
                if (!col) {
                    return;
                }

                const points: Array<Vector2> = [
                    new Vector2(col.topLeft.x, col.topLeft.y + gameWorldSize.y - col.height),
                    new Vector2(col.topRight.x, col.topRight.y + gameWorldSize.y - col.height),
                    new Vector2(col.bottomRight.x, col.bottomRight.y + gameWorldSize.y - col.height),
                    new Vector2(col.bottomLeft.x, col.bottomLeft.y + gameWorldSize.y - col.height),
                ];

                // I mean. Who would want SVG Polygon creation to be easy and fun...
                const poly: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                points.forEach(point => {
                    const svgPoint: DOMPoint = elem.createSVGPoint(); // Why can't this just take params.
                    svgPoint.x = point.x;
                    svgPoint.y = point.y;
                    poly.points.appendItem(svgPoint);
                });
                poly.style.fill = 'rgba(0, 255, 0, 0.3)';
                poly.style.stroke = 'purple';
                poly.style.strokeWidth = '1';
                frag.appendChild(poly);
            });
            this.emptyColliderSvg();

            elem.appendChild(frag);
        });
    }

    emptyColliderSvg(): void {
        this.shadowRoot.querySelector('#colliders').innerHTML = '';
    }

    render() {
        return html`
            <svg id="colliders" width="100%" height="100%"></svg>
        `;
    }
}
