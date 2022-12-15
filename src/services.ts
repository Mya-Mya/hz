import { View } from "./View"
import { p } from "./main"
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
