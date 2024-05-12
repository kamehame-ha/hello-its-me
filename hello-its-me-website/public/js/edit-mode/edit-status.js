import { makeEditable, makeReadOnly } from "../functions/input-state.js"
import { save } from "../functions/save.js"

export const editStatus = async (data, user_object) => {
    const status = document.getElementById("status")
    status.value = data.status
    status.addEventListener("click", () =>  makeEditable(status))
    status.addEventListener("focusout", () =>  makeReadOnly(status))
    status.addEventListener("keyup", async (e) => {
        if(e.key === "Enter" && document.activeElement === status) {
            user_object.status = status.value
            await save(user_object)
        }
    })
}