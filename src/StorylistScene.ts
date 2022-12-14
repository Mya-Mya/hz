import P5 from "p5"
import { Scene } from "./Scene";
import { get_image } from "./images"

// Input entity
let clicking: boolean = false

// Preview entity
type Preview = {
    title: string,
}
const previews: Preview[] = [
    { title: "序章" },
    { title: "雷雨の夜に" },
    { title: "何か" }
]
// preview_index entity
let preview_index = 0

// preview animation entity
let preview_anim_t = 0
let preview_anim_running = true

// Bubble entity
type Bubble = {
    x: number
    y: number
    theta: number
    v: number
    rr: number
    rg: number
    rb: number
    rd: number
    lifetime: number
    filled: boolean
}
let bubbles: Bubble[] = []

const draw_preview = (p: P5) => {
    p.push()
    p.textAlign(p.CENTER, p.CENTER)
    p.fill(255, 255, 255, preview_anim_t * 255)
    p.textSize(50 + 50 * p.pow(preview_anim_t, 0.2))
    p.text(previews[preview_index].title, p.width * 0.5, p.height * 0.5)
    p.textSize(18)
    p.text(`${preview_index + 1}/${previews.length}`, p.width * 0.5, p.height * 0.5 + 70)
    p.pop()
}

const update_preview_anim = (p: P5) => {
    if (preview_anim_running) {
        preview_anim_t += 0.09
        if (preview_anim_t > 1) {
            preview_anim_running = false

        }
    }
}

const start_preview_anim = () => {
    if (!preview_anim_running) {
        preview_anim_running = true
        preview_anim_t = 0
    }
}

const add_multiple_bubbles = (x: number, y: number) => {
    for (let i = 0; i < 15; i++) {
        bubbles.push({
            x,
            y,
            v: Math.random() * 4,
            theta: Math.random() * 2 * Math.PI,
            rr: 0.8 + Math.random() * 0.3,
            rg: 0.9 + Math.random() * 0.2,
            rb: 0.8 + Math.random() * 0.4,
            rd: 0.7 + Math.random(),
            lifetime: 0,
            filled: Math.random() < 0.4
        })
    }
}

const update_bubbles = () => {
    bubbles.forEach(bubble => {
        bubble.x += bubble.v * Math.cos(bubble.theta)
        bubble.y += bubble.v * Math.sin(bubble.theta)
        bubble.lifetime += 0.01
        bubble.v += 0.01
    })
    bubbles = bubbles.filter(bubble => bubble.lifetime < 1)
}

const draw_bubbles = (p: P5) => {
    p.push()
    p.blendMode(p.ADD)
    bubbles.forEach(bubble => {
        const color = p.color(108 * bubble.rr, 195 * bubble.rg, 239 * bubble.rb, 255 * p.pow(1 - bubble.lifetime, 2))
        if (bubble.filled) {
            p.fill(color)
            p.noStroke()
        } else {
            p.stroke(color)
            p.noFill()
        }
        p.circle(bubble.x, bubble.y, 20 * bubble.rd)
    })
    p.pop()
}

// Button entity
const BUTTON_HEIGHT = 60
const BUTTON_WIDTH = 150
type Button = {
    x: number
    y: number
    hover: boolean
    clicked: boolean
    text: string
    important: boolean
}
const is_in_button = (x: number, y: number, b: Button) => (Math.abs(x - b.x) * 2 < BUTTON_WIDTH) && (Math.abs(y - b.y) * 2 < BUTTON_HEIGHT)
const prev_button: Button = { x: 130, y: 500, hover: false, clicked: false, text: "<<", important: false }
const next_button: Button = { x: 1136 - 130, y: 500, hover: false, clicked: false, text: ">>", important: false }
const open_button: Button = { x: 1136 / 2, y: 500, hover: false, clicked: false, text: "開く", important: true }
let buttons: Button[] = [prev_button, next_button, open_button]
const update_buttons = (p: P5) => buttons.forEach(b => {
    b.hover = is_in_button(p.mouseX, p.mouseY, b)
    b.clicked = b.hover && clicking
})
const draw_buttons = (p: P5) => {
    p.push()
    p.rectMode(p.CENTER)
    p.textAlign(p.CENTER, p.CENTER)
    p.noStroke()
    buttons.forEach(b => {
        if (b.important) {
            if (b.hover) p.fill(255, 202, 107)
            else p.fill(255, 182, 97)
        } else {
            if (b.hover) p.fill(128, 215, 255)
            else p.fill(108, 195, 239)
        }
        p.circle(b.x - 40, b.y, BUTTON_HEIGHT)
        p.circle(b.x + 40, b.y, BUTTON_HEIGHT)
        p.rect(b.x, b.y, BUTTON_WIDTH - 80, BUTTON_HEIGHT)
        p.fill("white")
        p.text(b.text, b.x, b.y)
    })
    p.pop()
}

// preview switch switcher
const preview_switch_watcher = () => {
    if (next_button.clicked) preview_index = (preview_index + 1) % previews.length
    if (prev_button.clicked) preview_index = (previews.length + preview_index - 1) % previews.length
    if (next_button.clicked || prev_button.clicked) start_preview_anim()
}

// openbutton watcher
const openbutton_watcher = async () => {
    if (open_button.clicked) {
        start_preview_anim()
        add_multiple_bubbles(1136 / 2, 320)
        await new Promise(resolve => setTimeout(resolve, 200))
        await run_feedout_async()
        alert("Feedout End")
    }
}
// feedout
let feedout_t = 0
let feedout_runnning = false
let feedout_resolve = undefined
const draw_feedout = (p: P5) => {
    p.push()
    p.fill(0, 0, 0, feedout_t * 255)
    p.rect(0, 0, p.width, p.height)
    p.pop()
}
const update_feedout = () => {
    if (feedout_runnning) {
        feedout_t += 0.02
        if (feedout_t >= 1) {
            feedout_runnning = false
            feedout_resolve()
        }
    }
}
const run_feedout_async = () => {
    feedout_runnning = true
    return new Promise(resolve => feedout_resolve = resolve)
}
export class StorylistScene implements Scene {
    on_enter(p: P5): void {

    }
    draw(p: P5): void {
        p.image(get_image("bg0.png"), 0, 0)

        update_bubbles()
        draw_bubbles(p)

        update_preview_anim(p)
        draw_preview(p)

        update_buttons(p)
        draw_buttons(p)

        preview_switch_watcher()
        openbutton_watcher()

        update_feedout()
        draw_feedout(p)

        clicking = false
    }
    mousePressed(e: object, p: P5): void {
        clicking = true
    }
}