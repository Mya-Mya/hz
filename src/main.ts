import P5 from "p5"
import { Scene } from "./Scene"
import { WelcomeScene } from "./WelcomeScene"
import { StorylistScene } from "./StorylistScene"

import { preload_images } from "./images"

const name_to_scene = {
    "Storylist": new StorylistScene(),
    "Weocome": new WelcomeScene()
}
let scene: Scene = name_to_scene["Storylist"]

export const change_scene = (name: string) => {
    scene = name_to_scene[name]
    scene.on_enter(p)
}

const preload = (p: P5) => {
    preload_images(p)
}
const setup = (p: P5) => {
    p.createCanvas(1136, 640)
    scene.on_enter(p)
}

const draw = (p: P5) => {
    scene.draw(p)
}
const mousePressed = (e: object, p: P5) => {
    scene.mousePressed(e, p)
}

const sketch = (p: P5) => {
    p.preload = () => preload(p)
    p.setup = () => setup(p)
    p.draw = () => draw(p)
    p.mousePressed = (e: object) => mousePressed(e, p)
}

const p = new P5(sketch)