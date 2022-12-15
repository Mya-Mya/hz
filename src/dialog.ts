import P5 from "p5"
import { backIn, backOut, backInOut } from "eases"
import {ButtonVariant, Button } from "./button"
import { p } from "./main"
import { BLACK, CANVAS_HEIGHT, CANVAS_WIDTH, NAVY, NORMAL_TEXTSIZE, WHITE } from "./uiconstants"
import { View } from "./View"
const DIALOG_WIDTH = 700
const BUTTON_AREA_WIDTH = 600
const DIALOG_HEIGHT = 330
const BUTTON_Y = (CANVAS_HEIGHT + DIALOG_HEIGHT) / 2 - 50
const BUTTON_AREA_LEFT = (CANVAS_WIDTH - BUTTON_AREA_WIDTH) / 2

export class Dialog extends View {
    /**
     * Press -> Call handler Flow
     * 1. Press the Button
     * 2. Start closing transition
     * 3. Finish closing transition
     * 4. Call on_select handler
     */
    private button_s: Button[] = []

    private is_opening: boolean = true
    private opening_s: number = 0
    private is_closing: boolean = false
    private closing_s: number = 0

    private on_close_handler: () => void = undefined
    private calling_on_select_handler: () => void = undefined

    constructor(private text: string) { super() }
    add_button(text: string, variant: ButtonVariant, on_select: () => void) {
        const new_button = new Button(0, BUTTON_Y, text)
        new_button.set_variant(variant)
        new_button.add_onclick_handler(() => {
            this.calling_on_select_handler = on_select
            this.is_closing = true
        })
        this.button_s.push(new_button)

        const dx = BUTTON_AREA_WIDTH / (this.button_s.length + 1)
        for (let i = 0; i < this.button_s.length; i++) {
            const new_x = BUTTON_AREA_LEFT + dx * (i + 1)
            this.button_s[i].x = new_x
        }
    }
    tick(): void {
        p.push()
        if (this.is_opening) this.tick_opening()
        if (this.is_closing) this.tick_closing()

        p.push()
        p.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        p.rectMode(p.CENTER)
        p.noStroke()
        p.fill(WHITE())
        p.rect(0, 0, DIALOG_WIDTH, DIALOG_HEIGHT, 10, 10)

        p.textAlign(p.CENTER, p.CENTER)
        p.fill(NAVY())
        p.textSize(NORMAL_TEXTSIZE)
        p.text(this.text, 0, 0)
        p.pop()

        this.button_s.forEach(_ => _.tick())
        p.pop()
    }
    private tick_opening(): void {
        p.translate(0, (backOut(1) - backOut(this.opening_s)) * 500)
        this.opening_s += 0.05
        if (this.opening_s >= 1) this.is_opening = false
    }
    private tick_closing(): void {
        p.translate(0, (backOut(1) - backOut(1 - this.closing_s)) * 500)
        this.closing_s += 0.05
        if (this.closing_s >= 1) {
            this.is_closing = true
            this.calling_on_select_handler()
            this.on_close_handler()
        }
    }
    public set_on_close_handler(handler: () => void) {
        this.on_close_handler = handler
    }
    mouse_pressed(e: any): boolean {
        for (const button of this.button_s) {
            if (button.mouse_pressed(e)) return true
        }
        return false
    }
}