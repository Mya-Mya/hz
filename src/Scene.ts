import P5 from "p5"
export interface Scene{
    on_enter(p:P5):void
    draw(p:P5):void
    mousePressed(e:object,p:P5):void
}