import { css, customElement, html, LitElement } from 'lit-element';
import Muzzle from './Muzzle';

@customElement('bullet-gun-muzzle')
export default class BulletGunMuzzle extends Muzzle {
    offsetX: number = 7.5;
    offsetY: number = -7.5;

    render() {
        return html`
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 5px;
                    height: 5px;
                    transition: 10ms linear;
                    transform: translate(${this.offsetX}px, ${this.offsetY}px) scale(0);
                }

                :host(.flash) {
                    transform: translate(${this.offsetX}px, ${this.offsetY}px) scale(4);
                }

                .bottom-flash-left {
                    left: 0;
                    position: absolute;
                    height: 5px;
                    transform: rotate(-45deg);
                    width: 3px;
                    background: linear-gradient(45deg, #ea6e33, #ffeb3b);
                }
                .bottom-flash-right {
                    right: 0;
                    position: absolute;
                    height: 5px;
                    transform: rotate(45deg);
                    width: 3px;
                    background: linear-gradient(45deg, #ea6e33, #ffeb3b);
                }

                .flash-center {
                    width: 3px;
                    height: 6px;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 1px;
                    background: linear-gradient(45deg, #ea6e33, #ffeb3b);
                    margin: auto;
                }

                .flash-center-end {
                    position: absolute;
                    top: -3px;
                    transform: rotate(45deg);
                    background: linear-gradient(45deg, #ea6e33, #ffeb3b);
                    height: 3px;
                    width: 3px;
                    left: 0;
                    right: 0;
                    margin: auto;
                }
            </style>
            <div class="bottom-flash-left"></div>
            <div class="bottom-flash-right"></div>
            <div class="flash-center"></div>
            <div class="flash-center-end"></div>
        `;
    }
}
