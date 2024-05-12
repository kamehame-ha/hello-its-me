let getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

let setCookie = (cname, cvalue) => {
    const d = new Date();
    d.setTime(d.getTime() + (60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";samesite=none";
}

function OnInput() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
}

async function securedReq(url, method, body) {
    const requestOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getCookie("token")}`
        },
        body: JSON.stringify(body) ?? null
    }

    const res = await fetch(url, requestOptions)
    return res
}

async function save(object) {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getCookie("token")}`
        },
        body: JSON.stringify(object)
    };

    const res = await fetch(`${apiUrl}/api/user/`, requestOptions)

    if(res.ok && res.status === 204) {
        location.href = "/profile/edit"
    }
}
const apiUrl = "https://its-me-api.kame.pro"

window.onload = async () => {
    const card = document.getElementById("card")
    const mobile_block = document.getElementById("mobile-block")

    // Block editing on mobile
    mobile_block.style.display = "none"

    window.addEventListener('resize', () => {
        if(window.innerWidth < 640) {
            card.style.display = "none"
            mobile_block.style.display = "flex"
        } else {
            card.style.display = "block"
            mobile_block.style.display = "none"
        }
    })

    const icon_edit = document.getElementById("icon-edit")
    icon_edit.style.display = "none"

    const makeReadOnly = (el) => {
        el.setAttribute("readonly", true)
    }

    const makeEditable = (el) => {
        el.removeAttribute("readonly")
        el.focus()
    }

    const res = await securedReq(`${apiUrl}/api/user`, "GET")
    const data = await res.json()

    const user_object = {
        nickname: null,
        status: null,
        avatarUrl: null,
        pictureUrl: null,
        socialAccounts: data.socialAccounts ?? [],
        bio: null,
        colorScheme: null
    }

    document.title = `Hello its me - ${data.nickname ? data.nickname : data.username}`
    if(window.innerWidth < 640) {
        card.style.display = "none"
        mobile_block.style.display = "flex"
    } else {
        card.style.display = "block"
    }

    const bg = document.getElementById("background")
    bg.style.backgroundImage = `url(/img/backgrounds/${data.colorScheme}.svg)`

    const text = document.querySelectorAll(".text-var")
    const stroke = document.querySelectorAll(".stroke-var")
    const border = document.querySelectorAll(".border-var")
    const outline = document.querySelectorAll(".outline-var")
    const background = document.querySelectorAll(".bg-var")

    text.forEach(x => {
        x.classList.add(`text-${data.colorScheme}`)
    })

    stroke.forEach(x => {
        x.classList.add(`stroke-${data.colorScheme}`)
    })

    border.forEach(x => {
        x.classList.add(`border-${data.colorScheme}`)
    })

    outline.forEach(x => {
        x.classList.add(`outline-${data.colorScheme}`)
    })

    background.forEach(x => {
        x.classList.add(`background-${data.colorScheme}`)
    })

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

    const bio = document.getElementById("bio")
    const bio_show = document.getElementById("bio-show")
    const bio_text = document.getElementById("bio-text")
    const bio_arrow = document.getElementById("bio-arrow")
    const user_card_mid = document.getElementById("user-card-mid")

    let clicked = false
    let bioText = data.bio

    if (bioText.length > 100 && bioText.substring(0, 100).lastIndexOf(" ") !== -1) {
        bioText = bioText.substring(0, bioText.substring(0, 100).lastIndexOf(" "));
        bio.style.height = "40px"
        bio.value = bioText + "..."
    } else {
        bio_show.style.display = "none"
        user_card_mid.style.height = "auto"
        const tx = document.getElementsByTagName("textarea");
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }
        bio.value = bioText
    }

    bio.addEventListener("click", () => {
        makeEditable(bio)
        if(clicked) return
        bio_text.innerText = "Hide Bio"
        bio_arrow.style.rotate = "180deg"
        bio.style.cursor = "text"

        bio.style.height = "auto"
        user_card_mid.style.height = "auto"
        user_card_mid.style.width = "100%"
        bio.value = data.bio
        bioText = data.bio

        const tx = document.getElementsByTagName("textarea");
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }
        clicked = true
    })

    bio.addEventListener("focusout", () => {
        makeReadOnly(bio)
        if(!clicked) return
        bio_text.innerText = "Expand Bio"
        bio_arrow.style.rotate = "0deg"
        bio.style.cursor = "pointer"

        if (bioText.length > 100 && bioText.substring(0, 100).lastIndexOf(" ") !== -1) {
            bioText = bioText.substring(0, bioText.substring(0, 100).lastIndexOf(" "));
            bio.style.height = "40px"
            bio.value = bioText + "..."
        } else {
            bio_show.style.display = "none"
            user_card_mid.style.height = "auto"
            bio.style.height = "fit-content"
            bio.value = bioText
        }
        user_card_mid.style.width = "calc(100% - 180px)"
        clicked = false
    })
    bio.addEventListener("keyup", async (e) => {
    if(e.key === "Enter" && document.activeElement === bio) {
            user_object.bio = bio.value
            await save(user_object)
        }
    })
    bio.addEventListener("keydown", (e) => { if(e.key === "Enter") e.preventDefault() })
    
    bio_show.addEventListener("click", () => {
        if(!clicked) {
            bio_text.innerText = "Hide Bio"
            bio_arrow.style.rotate = "180deg"
            bio.style.cursor = "text"

            bio.style.height = "auto"
            user_card_mid.style.height = "auto"
            user_card_mid.style.width = "100%"
            bio.value = data.bio
            bioText = data.bio

            const tx = document.getElementsByTagName("textarea");
            for (let i = 0; i < tx.length; i++) {
                tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
                tx[i].addEventListener("input", OnInput, false);
            }
            clicked = true
        } else {
            bio_text.innerText = "Expand Bio"
            bio_arrow.style.rotate = "0deg"
            bio.style.cursor = "pointer"

            if (bioText.length > 100 && bioText.substring(0, 100).lastIndexOf(" ") !== -1) {
                bioText = bioText.substring(0, bioText.substring(0, 100).lastIndexOf(" "));
                bio.style.height = "40px"
                bio.value = bioText + "..."
            } else {
                bio_show.style.display = "none"
                user_card_mid.style.height = "auto"
                bio.style.height = "fit-content"
                bio.value = bioText
            }
            user_card_mid.style.width = "calc(100% - 180px)"
            clicked = false
        }
    })

    const avatar = document.getElementById("avatar-bg")
    const picture = document.getElementById("picture-bg")

    // File
    if(data.avatarUrl) {
        avatar.style.backgroundImage = `url("${data.avatarUrl}")`
    }

    if(data.pictureUrl) {
        picture.style.backgroundImage = `url("${data.pictureUrl}")`
    }

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

    const avatar_upload = document.getElementById("avatar")
    avatar_upload.addEventListener("change", async (event) => {
        const file = event.target.files[0]
        if(!file) return

        const form = new FormData();
        form.append("file", file)

        const res = await fetch("/api/upload/avatar", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getCookie("token")}`
            },
            body: form
        })

        // Add upload info

        const data = await res.json()

        user_object.avatarUrl = data.url
        await save(user_object)
    })

    const picture_upload = document.getElementById("picture")
    picture_upload.addEventListener("change", async (event) => {
        const file = event.target.files[0]
        if(!file) return

        const form = new FormData();
        form.append("file", file)

        const res = await fetch("/api/upload/picture", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getCookie("token")}`
            },
            body: form
        })

        // Add upload info

        const data = await res.json()

        user_object.pictureUrl = data.url
        await save(user_object)
    })

    // Editing color scheme
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