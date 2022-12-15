import P5 from "p5"
import { StorylistScene } from "./StorylistScene"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./uiconstants"
import { preload_images } from "./images"
import { scene_manage_service, modal_manage_service, fade_service } from "./services"

scene_manage_service.set_scene(new StorylistScene())

const service_s_from_bottom = [scene_manage_service, modal_manage_service, fade_service]
const service_s_from_top = [...service_s_from_bottom].reverse()
const sketch = (_p: P5) => {
    _p.preload = () => {
        preload_images(p)
    }
    _p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
        service_s_from_bottom.forEach(s => s.on_enter())
    }
    _p.draw = () => {
        service_s_from_bottom.forEach(s => s.tick())
    }
    _p.mousePressed = (e: object) => {
        for (const s of service_s_from_top) {
            const require_exclusion = s.mouse_pressed(e)
            if (require_exclusion) return
        }
    }
}

export const p = new P5(sketch)