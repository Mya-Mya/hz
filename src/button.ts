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

/*export type Button = {
    x: number,
    y: number,
    text: string,
    variant: ButtonVariant
    hover: boolean,
    onclick_handler_s: (() => void)[]
}
export const create_button = (x: number, y: number, text: string): Button => ({
    x, y, text,
    variant: ButtonVariant.Normal,
    hover: false,
    onclick_handler_s: []
})
*/
export enum ButtonVariant {
    Normal,
    Important
}/*
const button_color_s = {
    [ButtonVariant.Normal]: LIGHTBLUE,
    [ButtonVariant.Important]: ORANGE
}
const draw_button_internal = (button: Button) => {
    let color = button_color_s[button.variant]()
    if (button.hover) color = brighter(color)

    p.push()
    p.translate(button.x, button.y)
    p.fill(color)
    p.rect(0, 0, RECT_W, BUTTON_HEIGHT)
    p.circle(L1, 0, BUTTON_HEIGHT)
    p.circle(L2, 0, BUTTON_HEIGHT)
    p.fill(WHITE())
    p.text(button.text, 0, 0)
    p.pop()
}
export const draw_button_s = (button_s: Button[]) => {
    p.push()
    p.rectMode(p.CENTER)
    p.noStroke()
    p.textSize(NORMAL_TEXTSIZE)
    p.textAlign(p.CENTER, p.CENTER)
    button_s.forEach(draw_button_internal)
    p.pop()
}
export const update_button_s = (button_s: Button[], mouse_x: number, mouse_y: number) => button_s.forEach(button => {
    button.hover = (
        Math.abs(button.x - mouse_x) * 2 < BUTTON_WIDTH &&
        Math.abs(button.y - mouse_y) * 2 < BUTTON_HEIGHT
    )
})
export const dispose_mouse_press_to_button_s = (button_s: Button[]) => button_s.forEach(button => {
    if (button.hover) button.onclick_handler_s.forEach(f => f())
})*/

export class Button_ extends View {
    private variant: ButtonVariant = ButtonVariant.Normal
    private hover: boolean = false
    private onclick_handler_s: (() => void)[] = []
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
    set_variant(vatiant: ButtonVariant) {
        this.variant = vatiant
    }
    mouse_pressed(e: any): boolean {
        if (this.hover) this.onclick_handler_s.forEach(_ => _())
        return this.hover
    }
}