import P5 from "p5"
export const image_name_s = [
    "bg0.png"
]
let name_to_image: Object = {}
export const preload_images = (p: P5) => image_name_s.forEach(name => {
    name_to_image[name] = p.loadImage(name)
})
export const get_image = (name: string) => {
    return name_to_image[name]
}