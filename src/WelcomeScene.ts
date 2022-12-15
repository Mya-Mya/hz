import P5 from "p5"
import { View } from "./View";
import { get_image } from "./images"
import { p } from "./main"
import {add_ripple,draw_ripple_s,update_ripple_s} from "./ripple"
import { BLACK, CANVAS_HEIGHT, CANVAS_WIDTH, LARGE_TEXTSIZE, LIGHTBLUE, NORMAL_TEXTSIZE, WHITE } from "./uiconstants";
import {fade_service} from "./services"

// starttext entity
let starttext_anim = 0//component
const update_starttext_brightness = () => {//system
    starttext_anim += 0.01
    if (starttext_anim > 1) starttext_anim = 0
}
const draw_starttext = () => {
    p.push()
    p.textAlign(p.CENTER)
    const color = LIGHTBLUE()
    color.setAlpha(starttext_anim * 255)
    p.fill(color)
    p.textSize(NORMAL_TEXTSIZE)
    p.text("Start", CANVAS_WIDTH/2,CANVAS_HEIGHT-50)
    p.pop()
}

export class WelcomeScene extends View {
    on_enter(): void {
        fade_service.start_in(()=>{})
    }
    tick(): void {
        p.image(get_image("bg0.png"), 0, 0)
        p.push()
        p.fill(WHITE())
        p.textSize(NORMAL_TEXTSIZE)
        p.textAlign(p.RIGHT)
        p.text("黒歴史の先に...", 500, 300)
        p.textSize(LARGE_TEXTSIZE)
        p.text("Houlex続営機関", 500, 360)
        p.pop()
        update_starttext_brightness()
        draw_starttext()

        update_ripple_s()
        draw_ripple_s()
    }
    mouse_pressed(e: object) {
        add_ripple(p.mouseX, p.mouseY)
        fade_service.start_out(()=>{
            alert("Feed out done")
        })
        return false
    }
}