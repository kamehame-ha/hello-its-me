export const makeReadOnly = (el) => {
    el.setAttribute("readonly", true)
}

export const makeEditable = (el) => {
    el.removeAttribute("readonly")
    el.focus()
}

export function OnInput() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
}