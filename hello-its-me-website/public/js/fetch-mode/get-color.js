export const userColor = async (data) => {
    // Get main background and set to selected color scheme
    // const bg = document.getElementById("background")
    // bg.style.backgroundImage = `url(/img/backgrounds/${data.colorScheme}.svg)`

    // Get all color scheme elements
    const text = document.querySelectorAll(".text-var")
    const stroke = document.querySelectorAll(".stroke-var")
    const border = document.querySelectorAll(".border-var")
    const outline = document.querySelectorAll(".outline-var")
    const background = document.querySelectorAll(".bg-var")

    // Loop to change color to chosen
    text.forEach(x => {
        x.classList.replace("text-var", `text-${data.colorScheme}`)
    })

    stroke.forEach(x => {
        x.classList.replace("stroke-var", `stroke-${data.colorScheme}`)
    })

    border.forEach(x => {
        x.classList.replace("border-var", `border-${data.colorScheme}`)
    })

    outline.forEach(x => {
        x.classList.replace("outline-var", `outline-${data.colorScheme}`)
    })

    background.forEach(x => {
        x.classList.replace("bg-var", `background-${data.colorScheme}`)
    })
}