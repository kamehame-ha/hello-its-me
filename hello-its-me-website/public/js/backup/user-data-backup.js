let getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) == ' ') {
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

async function securedReq(url, method, body) {
    const requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(body) ?? null
    }

    const res = await fetch(url, requestOptions)
    return res
}

const apiUrl = "https://its-me-api.kame.pro"

window.onload = async () => {
    const card = document.getElementById("card")

    const res = await securedReq(`${apiUrl}/api/user/${location.href.split("/")[4]}`, 'GET')
    const data = await res.json()

    document.title = `Hello its me - ${data.nickname ? data.nickname : data.username}`
    card.style.display = "block"

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
    nickname.innerText = data.nickname ?? data.username

    const status = document.getElementById("status")
    status.innerText = data.status

    const bio = document.getElementById("bio")
    const bio_show = document.getElementById("bio-show")
    const bio_text = document.getElementById("bio-text")
    const bio_arrow = document.getElementById("bio-arrow")
    const user_card_mid = document.getElementById("user-card-mid")

    let clicked = false
    let bioText = data.bio

    if (bioText.length > 100 && bioText.substring(0, 100).lastIndexOf(" ") !== -1) {
        bioText = bioText.substring(0, bioText.substring(0, 100).lastIndexOf(" "));

        if(window.innerWidth > 640) {
            bio.style.height = "40px"
        }
    } else {
        bio_show.style.display = "none"
        user_card_mid.style.height = "auto"
        bio.style.height = "fit-content"
    }

    bio.innerText = bioText + "..."

    window.addEventListener('resize', () => {
        if(window.innerWidth < 640) {
            bio.style.height = "auto"
        }
    })

    bio_show.addEventListener("click", () => {
        if(!clicked) {
            bio_text.innerText = "Hide Bio"
            bio_arrow.style.rotate = "180deg"

            bio.style.height = "auto"
            user_card_mid.style.height = "auto"
            user_card_mid.style.width = "100%"
            bio.innerText = data.bio
            bioText = data.bio

            clicked = true
        } else {
            bio_text.innerText = "Expand Bio"
            bio_arrow.style.rotate = "0deg"

            if (bioText.length > 100 && bioText.substring(0, 100).lastIndexOf(" ") !== -1) {
                bioText = bioText.substring(0, bioText.substring(0, 100).lastIndexOf(" "));
                if  (window.innerWidth > 640) {
                    bio.style.height = "40px"
                }
            } else {
                bio_show.style.display = "none"
                user_card_mid.style.height = "auto"
                bio.style.height = "fit-content"
            }
            if  (window.innerWidth > 640) {
                user_card_mid.style.width = "calc(100% - 180px)"
            }
            bio.innerText = bioText + "..."

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
    const info = document.getElementById("info")

    data.socialAccounts.forEach(x => {
        const element = icon_box.appendChild(document.createElement('div'))
        const icon_url = `/img/icons/social/${x.name.toLowerCase()}.svg`
        element.classList.add("social-icon-box")

        if(x.value.includes("http")) {
            element.innerHTML = `<a href="${x.value}" class="flex" target="_blank"><img src="${icon_url}" alt="${x.name}"></a>`
        } else {
            element.innerHTML = `<img src="${icon_url}" class="flex" alt="${x.name}">`
            element.style.cursor = "pointer"
            element.addEventListener('click', () => {
                info.innerText = `Copied content of ${x.name} to clipboard`
                info.style.display = "block"
                info.style.opacity = "0"

                setTimeout(() => {
                    info.style.opacity = "1"
                    navigator.clipboard.writeText(x.value)
                }, 300)

                setTimeout(() => {
                    info.style.opacity = "0"

                    setTimeout(() => {
                        info.style.display = "none"
                    }, 300)
                }, 2700)
            }) 
        }
    })
}