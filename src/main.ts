import P5 from "p5"
import { Scene } from "./Scene"
import { WelcomeScene } from "./WelcomeScene"
import { StorylistScene } from "./StorylistScene"

import { preload_images } from "./images"

const name_to_scene = {
    "Storylist": new StorylistScene(),
    "Welcome": new WelcomeScene()
}
let scene: Scene = undefined

export const change_scene = (name: string) => {
    scene = name_to_scene[name]
    scene.on_enter()
}

change_scene("Welcome")

const preload = () => {
    preload_images(p)
}
const setup = () => {
    p.createCanvas(1136, 640)
    scene.on_enter()
}

const tick = () => {
    scene.tick()
}
const mouse_pressed = (e: object) => {
    scene.mouse_pressed(e)
}

const sketch = (_p:P5) => {
    _p.preload = () => preload()
    _p.setup = () => setup()
    _p.draw = () => tick()
    _p.mousePressed = (e: object) => mouse_pressed(e)
}

export const p = new P5(sketch)