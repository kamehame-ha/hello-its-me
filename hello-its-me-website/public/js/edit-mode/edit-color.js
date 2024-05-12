import { save } from "../functions/save.js"

export const editColor = async (data, user_object) => {
    const card = document.getElementById("card")
    const content = document.getElementById("content")
    const scheme_editor = document.getElementById("color-scheme-editor")
    let mouseOnCard = false
    let colorSchemeEditorOpen = false

    card.addEventListener('mouseover', () => {
        if(!colorSchemeEditorOpen) return
        mouseOnCard = true;
        scheme_editor.style.display = "none"
    });

    card.addEventListener('mouseout', () => {
        mouseOnCard = false;
    });

    scheme_editor.addEventListener('mouseover', () => {
        mouseOnCard = true;
    });

    scheme_editor.addEventListener('mouseout', () => {
        mouseOnCard = false;
    });

    content.addEventListener("click", (event) => {
        if(mouseOnCard) return
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        scheme_editor.style.left = `${mouseX - 202}px`
        scheme_editor.style.top = `${mouseY - 60}px`

        scheme_editor.style.display = "block"
        colorSchemeEditorOpen = true
    })

    const colors_hex = {
        cyan: "#06b6d4",
        green: "#22c55e",
        indigo: "#6366f1",
        pink: "#ec4899",
        red: "#ef4444",
        sky: "#0ea5e9",
        teal: "#14b8a6",
        yellow: "#eab308",
        blue: "#3b82f6"
    }

    const colors = []
    Object.keys(colors_hex).forEach(x => colors.push(x))

    colors.forEach(x => {
        const element = document.getElementById(x)

        element.addEventListener("click", async () => {
            user_object.colorScheme = x
            await save(user_object)
        })
    })
}