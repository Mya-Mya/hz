import { p } from "../../main"
import { WHITE } from "../../uiconstants"
import { View } from "../../View"
import StoryPresenter from "./StoryPresenter"

export default class GotoNextPageArrow extends View {
    private dy: number = 0
    constructor(private presenter: StoryPresenter) { super() }
    tick(): void {
        if (this.presenter.is_content_animation_done()) {
            this.dy = 6 * p.sin(p.frameCount / 7)
            p.push()
            p.translate(920, 550 + this.dy)
            p.noStroke()
            p.fill(WHITE())
            p.triangle(-10, 0, 10, 0, 0, 20)
            p.pop()
        }
    }
}