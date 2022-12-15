import { View } from "./View"
import { p } from "./main"
import { BLACK, CANVAS_HEIGHT, CANVAS_WIDTH } from "./uiconstants"
class SceneManageService extends View {
    public scene: View
    tick = () => this.scene.tick()
    mouse_pressed = (e) => this.scene.mouse_pressed(e)
    set_scene(scene: View) {
        this.scene = scene
        scene.on_enter()
    }
}
export const scene_manage_service = new SceneManageService()

class ModalManageService extends View {
    public modal_s: View[] = []
    get has_active() {
        return this.modal_s.length != 0
    }
    get active_modal(): View {
        return this.has_active ?
            this.modal_s[0] :
            undefined
    }
    tick(): void {
        if (this.has_active) {
            const color = BLACK()
            p.push()
            color.setAlpha(128)
            p.fill(color)
            p.noStroke()
            p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            p.pop()
            this.active_modal.tick()
        }
    }
    mouse_pressed(e: any): boolean {
        if (this.has_active) {
            this.active_modal.mouse_pressed(e)
            return true
        }
        return false
    }
    delete(modal: View) {
        const index = this.modal_s.indexOf(modal)
        if (index >= 0) this.modal_s.splice(index, 1)
    }
    add(modal: View) {
        this.modal_s.push(modal)
    }
}
export const modal_manage_service = new ModalManageService()

class FadeService extends View {
    public is_active: boolean = false
    private fade_type: string
    private on_done: () => void
    private s: number
    private ds: number = 0.02

    tick(): void {
        if (!this.is_active) return
        this.s += this.ds
        if (this.s >= 1) {
            this.is_active = false
            if (this.on_done) this.on_done()
            return
        }

        p.push()
        const color = BLACK()
        switch (this.fade_type) {
            case "out":
                color.setAlpha(255 * this.s)
                break;
            case "in":
                color.setAlpha(255 * (1 - this.s))
                break;
        }
        p.fill(color)
        p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        p.pop()
    }
    start_out(on_done: () => void): void {
        this.start(on_done, "out")
    }
    start_in(on_done: () => void): void {
        this.start(on_done, "in")
    }
    private start(on_done: () => void, fade_type: string) {
        if (this.is_active) return
        this.fade_type = fade_type
        this.s = 0
        this.is_active = true
        this.on_done = on_done
    }
    mouse_pressed(e: any): boolean {
        return this.is_active
    }
}
export const fade_service = new FadeService()