import P5 from "p5"
import { backIn, backOut, backInOut } from "eases"
import { Button, ButtonVariant, update_button_s, dispose_mouse_press_to_button_s, draw_button_s } from "./button"
import { p } from "./main"
import { BLACK, CANVAS_HEIGHT, CANVAS_WIDTH, NAVY, NORMAL_TEXTSIZE, WHITE } from "./uiconstants"
const DIALOG_WIDTH = 700
const BUTTON_AREA_WIDTH = 600
const DIALOG_HEIGHT = 330
const BUTTON_Y = (CANVAS_HEIGHT + DIALOG_HEIGHT) / 2 - 50
const BUTTON_AREA_LEFT = (CANVAS_WIDTH - BUTTON_AREA_WIDTH) / 2

class Dialog {
    public button_s: Button[] = []
    public is_opening: boolean = true
    public opening_t: number = 0
    public is_closing: boolean = false
    public closing_t: number = 0
    public selected_select_handler: () => void
    constructor(public text: string) { }
    add_button(text: string, variant: ButtonVariant, select: () => void) {
        this.button_s.push({
            x: 0, y: BUTTON_Y, text, variant, hover: false,
            onclick_handler_s: [() => {
                this.is_closing = true
                this.selected_select_handler = select
            }]
        })
        const dx = BUTTON_AREA_WIDTH / (this.button_s.length + 1)
        for (let i = 0; i < this.button_s.length; i++) {
            this.button_s[i].x = BUTTON_AREA_LEFT + dx * (i + 1)
        }
    }
}
let dialogs: Dialog[] = []

export const add_2selections_dialog = (
    text: string,
    s1: string,
    s2: string,
    is_s2_important: boolean,
    on_s1_select: () => void,
    on_s2_select: () => void
) => {
    const dialog = new Dialog(text)
    dialog.add_button(s1, ButtonVariant.Normal, on_s1_select)
    dialog.add_button(s2, is_s2_important ? ButtonVariant.Important : ButtonVariant.Normal, on_s2_select)
    dialogs.push(dialog)
}

const get_active_dialog = (): Dialog => {
    if (dialogs.length == 0) return undefined
    return dialogs[dialogs.length - 1]
}
export const draw_dialog = () => {
    if (is_dialog_showing()) {
        const dialog = get_active_dialog()
        p.push()
        const bgcolor = BLACK()
        bgcolor.setAlpha(200)
        p.fill(bgcolor)
        p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        if (dialog.is_opening) p.translate(0, (backOut(1) - backOut(dialog.opening_t)) * 500)
        if (dialog.is_closing) p.translate(0, (backOut(1) - backOut(1 - dialog.closing_t)) * 500)

        p.rectMode(p.CENTER)
        p.fill(WHITE())
        p.rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, DIALOG_WIDTH, DIALOG_HEIGHT, 10, 10)

        p.textAlign(p.CENTER, p.CENTER)
        p.fill(NAVY())
        p.textSize(NORMAL_TEXTSIZE)
        p.text(dialog.text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)

        draw_button_s(dialog.button_s)
        p.pop()
    }
}
export const update_dialog = (mouse_x: number, mouse_y: number) => {
    if (is_dialog_showing()) {
        const dialog = get_active_dialog()
        if (dialog.is_opening) {
            dialog.opening_t += 0.05
            if (dialog.opening_t >= 1) dialog.is_opening = false
            return
        }
        if (dialog.is_closing) {
            dialog.closing_t += 0.05
            if (dialog.closing_t >= 1) {
                dialog.is_closing = false
                dialog.selected_select_handler()
                remove_current_dialog(dialog)
            }
            return
        }
        update_button_s(get_active_dialog().button_s, mouse_x, mouse_y)
    }
}
export const dispose_mouse_press_to_dialog = (): boolean => {
    if (is_dialog_showing()) {
        dispose_mouse_press_to_button_s(get_active_dialog().button_s)
        return true
    }
    return false
}
export const is_dialog_showing = () => dialogs.length != 0
export const remove_current_dialog = (dialog: Dialog) => {
    dialogs = dialogs.filter(_dialog => _dialog != dialog)
}