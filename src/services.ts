import { View } from "./View"
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
