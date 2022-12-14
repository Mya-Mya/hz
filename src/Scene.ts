export interface Scene{
    on_enter():void
    tick():void
    mouse_pressed(e:any):void
}