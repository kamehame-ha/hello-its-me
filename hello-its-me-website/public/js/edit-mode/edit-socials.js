import { save } from "../functions/save.js"
import { securedReq } from "../functions/secured-request.js"

export const editSocials = async (data, user_object) => {
    const icon_edit = document.getElementById("icon-edit")
    icon_edit.style.display = "none"

    const icon_box = document.getElementById("icon-box")
    const icon_show = document.getElementById("icon-show")
    const icon_text = document.getElementById("icon-text")
    const icon_arrow = document.getElementById("icon-arrow")
    const card_top = document.getElementById("card-top")
    const icon_box_edit = document.getElementById("icon-box-edit")
    const icon_edit_btn = document.getElementById("edit-icons")
    const icon_edit_btn_box = document.querySelector(".bts")
    const icon_edit_back_btn = document.getElementById("icon-edit-back")
    const icon_box_edit_text = document.getElementById("icon-box-edit-text")

    const search = document.getElementById("search")
    const result = document.getElementById("result")
    const result_text = document.getElementById("result-text")
    const search_text = document.getElementById("search-text")
    const search_input_text = document.getElementById("search-input-text")
    let search_active = true

    const card_content = document.getElementById("card-content")

    data.socialAccounts.forEach(x => {
        const element = icon_box.appendChild(document.createElement("div"))
        const icon_url = `/img/icons/social/${x.name.toLowerCase()}.svg`
        element.classList.add("social-icon-box")

        element.innerHTML = `<img src="${icon_url}" class="social-icon" alt="${x.name}">`
    })

    data.socialAccounts.forEach(x => {
        const element = icon_box_edit.appendChild(document.createElement("div"))
        const icon_url = `/img/icons/social/${x.name.toLowerCase()}.svg`
        element.classList.add("social-icon-box")

        element.innerHTML = `<img src="${icon_url}" class="social-icon" alt="${x.name}">`

        element.addEventListener("click", (event) => {
            // Click to edit func
            search_text.innerText = `Update value of ${event.target.alt}`
            search_input_text.innerText = "Value:"

            result_text.style.display = "none"
            search_active = false
            const index = data.socialAccounts.findIndex(x => x.name === event.target.alt)
            search.value = user_object.socialAccounts[index].value

            result.innerHTML = ""
            const el = result.appendChild(document.createElement('button'))
            el.innerText = "Delete this social"
            el.classList.add("text-white/50")
            el.addEventListener("click", async () => {
                user_object.socialAccounts = user_object.socialAccounts.filter(x => x.name !== event.target.alt)
                await save(user_object)
            })

            search.addEventListener("keyup", async (e) => {
                if(e.key === "Enter" && document.activeElement === search) {
                    user_object.socialAccounts[index].value = search.value
                    await save(user_object)
                }
            })
        })
    })

    const icons = document.getElementById("icon-box").querySelectorAll("div")

    let to_many_icons = false
    const showed_icons = []

    for (let i = 0; i < icons.length; i++) {
        if(i >= 10) {
            icons[i].style.display = "none"
            to_many_icons = true
        } else showed_icons.push(icons[i])
    }

    icon_edit_btn.addEventListener("click", () => {
        card_content.style.display = "none"
        icon_edit.style.display = "block"
    })

    if(data.socialAccounts.length === 0) {
        icon_edit_btn_box.style.margin = 0
        icon_box_edit.style.display = "none"
        icon_box_edit_text.style.display = "none"
    }

    icon_edit_back_btn.addEventListener("click", () => {
        card_content.style.display = "block"
        icon_edit.style.display = "none"
        user_object.socialAccounts = []

        search_active = true
        search_text.innerText = `Select social to edit or search to add new one`
        search_input_text.innerText = "Search:"
        search.value = ""
        result.style.display = "flex"
        result_text.style.display = "block"
        result.innerHTML = `<p class="no-result text-white/50 text-sm font-light">No social matches provided name</p>`
    })

    let icon_show_clicked = false
    if(to_many_icons) {
        icon_show.addEventListener("click", () => {
            if(!icon_show_clicked) {
                icon_text.innerText = "Hide"
                icon_arrow.style.rotate = "180deg"
                icon_show_clicked = true

                document.getElementById("icon-box").querySelectorAll("div").forEach(x => {
                    x.style.display = "flex"
                })

                card_top.style.height = "auto"

            } else {
                icon_text.innerText = "Show all"
                icon_arrow.style.rotate = "0deg"
                icon_show_clicked = false

                for (let i = 0; i < icons.length; i++) {
                    if(i >= 10) {
                        icons[i].style.display = "none"
                        to_many_icons = true
                    } else showed_icons.push(icons[i])
                }

                card_top.style.height = "100px"
            }
        })
    } else {
        icon_show.style.display = "none"
    }

    result.innerHTML = `<p class="no-result text-white/50 text-sm font-light">No social matches provided name</p>`
    search.addEventListener("input", async () => {
        if(!search_active) return

        if(search.value.length === 0) {
            return result.innerHTML = `<p class="no-result text-white/50 text-sm font-light">No social matches provided name</p>`
        }

        const res = await securedReq(`/api/icons/${search.value}`, "GET")
        const response = await res.json()

        result.innerHTML = ""
        
        if(!response || response.length === 0) {
            return result.innerHTML = `<p class="no-result text-white/50 text-sm font-light">No social matches provided name</p>`
        }

        response.forEach(x => {
            if(data.socialAccounts.find(y => y.name === x.replace(".svg", ""))) return

            const el = result.appendChild(document.createElement("img"))
            el.src = `/img/icons/social/${x}`
            el.title = `${x.replace(".svg", "")}`
            el.alt = `${x.replace(".svg", "")}`

            el.addEventListener("click", (event) => {
                // Click to edit func
                search_text.innerText = `Set value of ${event.target.alt}`
                search_input_text.innerText = "Value:"
                result.style.display = "none"
                result_text.style.display = "none"
                search_active = false
                search.value = ""

                search.addEventListener("keyup", async (e) => {
                    if(e.key === "Enter" && document.activeElement === search) {
                        user_object.socialAccounts.push({
                            name: event.target.alt,
                            value: search.value
                        })
                        await save(user_object)
                    }
                })
            })
        })
    })
}