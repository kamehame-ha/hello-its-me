export const randomColors = () => {
    // Hex values of color schemes
    // *Maybe useful someday*
    const colors_hex = {
        cyan: "#06b6d4",
        green: "#22c55e",
        indigo: "#6366f1",
        pink: "#ec4899",
        red: "#ef4444",
        sky: "#0ea5e9",
        teal: "#14b8a6",
        yellow: "#eab308",
    }

    // Generate color name list from object
    const colors = []
    Object.keys(colors_hex).forEach(x => colors.push(x))

    // Change background and save name to var
    const random = Math.floor(Math.random() * colors.length)
    const color = colors[random]

    // Get background element and set new background
    const bg = document.getElementById("background")
    bg.style.backgroundImage = `url(/img/backgrounds/${color}.svg)`

    // Get every color change element
    const text = document.querySelectorAll(".text-var")
    const stroke = document.querySelectorAll(".stroke-var")
    const border = document.querySelectorAll(".border-var")
    const outline = document.querySelectorAll(".outline-var")

    // Loop to change color of every needed element to randomized color
    text.forEach(x => {
        x.classList.replace("text-var", `text-${color}`)
    })

    stroke.forEach(x => {
        x.classList.replace("stroke-var", `stroke-${color}`)
    })

    border.forEach(x => {
        x.classList.replace("border-var", `border-${color}`)
    })

    outline.forEach(x => {
        x.classList.replace("outline-var", `outline-${color}`)
    })
}