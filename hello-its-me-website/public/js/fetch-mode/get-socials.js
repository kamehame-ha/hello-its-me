export const userSocials = async (data) => {
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