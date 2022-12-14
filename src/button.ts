import { p } from "./main"
import { LIGHTBLUE, ORANGE, WHITE, brighter } from "./uiconstants"
import { NORMAL_TEXTSIZE } from "./uiconstants"

export const BUTTON_HEIGHT = 60
export const BUTTON_WIDTH = 150
const L2 = (BUTTON_WIDTH - BUTTON_HEIGHT) / 2
const L1 = -L2
const RECT_W = BUTTON_WIDTH-BUTTON_HEIGHT

export type Button = {
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

export enum ButtonVariant {
    Normal,
    Important
}
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
})