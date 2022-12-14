import P5 from "p5"
import { p } from "./main"
import { LIGHTBLUE, ORANGE, WHITE, brighter } from "./uiconstants"
import { NORMAL_TEXTSIZE } from "./uiconstants"
import { View } from "./View"

export const BUTTON_HEIGHT = 60
export const BUTTON_WIDTH = 150
const L2 = (BUTTON_WIDTH - BUTTON_HEIGHT) / 2
const L1 = -L2
const RECT_W = BUTTON_WIDTH - BUTTON_HEIGHT

export enum ButtonVariant {
    Normal,
    Important
}

export class Button extends View {
    private variant: ButtonVariant = ButtonVariant.Normal
    private hover: boolean = false
    private onclick_handler_s: (() => void)[] = []
    private visible: boolean = true
    constructor(
        public x: number,
        public y: number,
        public text: string,
    ) { super() }
    add_onclick_handler(handler: () => void) {
        this.onclick_handler_s.push(handler)
    }
    private get_color() {
        let color: P5.Color
        switch (this.variant) {
            case ButtonVariant.Normal:
                color = LIGHTBLUE()
                break;
            case ButtonVariant.Important:
                color = ORANGE()
                break;
        }
        if (this.hover) {
            color = brighter(color)
        }
        return color
    }
    tick(): void {
        this.hover = (
            p.abs(this.x - p.mouseX) * 2 < BUTTON_WIDTH &&
            p.abs(this.y - p.mouseY) * 2 < BUTTON_HEIGHT
        )
        if (this.visible) {
            p.push()
            p.rectMode(p.CENTER)
            p.noStroke()
            p.translate(this.x, this.y)
            p.fill(this.get_color())
            p.rect(0, 0, RECT_W, BUTTON_HEIGHT)
            p.circle(L1, 0, BUTTON_HEIGHT)
            p.circle(L2, 0, BUTTON_HEIGHT)
            p.textAlign(p.CENTER, p.CENTER)
            p.fill(WHITE())
            p.textSize(NORMAL_TEXTSIZE)
            p.text(this.text, 0, 0)
            p.pop()
        }
    }
    set_variant(vatiant: ButtonVariant) {
        this.variant = vatiant
    }
    set_visible(b: boolean) {
        this.visible = b
    }
    mouse_pressed(e: any): boolean {
        if (this.hover) this.onclick_handler_s.forEach(_ => _())
        return this.hover
    }
}