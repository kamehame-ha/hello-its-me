import { makeEditable, makeReadOnly } from "../functions/input-state.js"
import { save } from "../functions/save.js"

export const editNickname = async (data, user_object) => {
    const nickname = document.getElementById("nickname")
    nickname.value = data.nickname ?? data.username
    nickname.addEventListener("click", () =>  makeEditable(nickname))
    nickname.addEventListener("focusout", () =>  makeReadOnly(nickname))
    nickname.addEventListener("keyup", async (e) => {
        if(e.key === "Enter" && document.activeElement === nickname) {
            user_object.nickname = nickname.value
            await save(user_object)
        }
    })
}