import { makeEditable, makeReadOnly, OnInput } from "../functions/input-state.js"
import { save } from "../functions/save.js"

export const editBio = async (data, user_object) => {
    // Get all of the main bio elements
    const bio = document.getElementById("bio")
    const bio_show = document.getElementById("bio-show")
    const bio_text = document.getElementById("bio-text")
    const bio_arrow = document.getElementById("bio-arrow")
    const user_card_mid = document.getElementById("user-card-mid")

    // Set variables:
    // clicked - bool for click action for expand/hide button
    // bioText - string var containing current bio text, gets edited on expand/hide
    let clicked = false
    let bioText = data.bio

    // Initial setup of bio
    // If text is longer than 100 characters, it is shortened
    if (bioText.length > 100 && bioText.substring(0, 100).lastIndexOf(" ") !== -1) {
        bioText = bioText.substring(0, bioText.substring(0, 100).lastIndexOf(" "));
        bio.style.height = "40px"
        bio.value = bioText + "..."
    // If not text is displayed normally
    // Also textarea event is needed to make edit action work
    } else {
        bio_show.style.display = "none"
        user_card_mid.style.height = "auto"
        const tx = document.getElementsByTagName("textarea");
        // Textarea event, makes area auto resize when text is put inside
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }
        bio.value = bioText
    }

    // Main edit event
    // Bio is set to editable and it is expanded (if needed)
    // This prevents editing and saving unexpanded text
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

        // Textarea event, makes area auto resize when text is put inside
        const tx = document.getElementsByTagName("textarea");
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }
        clicked = true
    })

    // If user clicks somewhere else changes are not saved, and bio returns to unexpanded state
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

    // Save while Enter key is pressed
    bio.addEventListener("keyup", async (e) => {
    if(e.key === "Enter" && document.activeElement === bio) {
            user_object.bio = bio.value
            await save(user_object)
        }
    })
    // Needed for some sort of bug i don't remember
    bio.addEventListener("keydown", (e) => { if(e.key === "Enter") e.preventDefault() })
    
    // Main bio function, it is part of live preview
    // Bio on the edit page works same as bio on the user page
    // Since it is editable, p was replaced with textarea
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
}