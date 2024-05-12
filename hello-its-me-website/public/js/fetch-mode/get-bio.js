export const userBio = async (data) => {
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
}