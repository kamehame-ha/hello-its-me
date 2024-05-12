import { hideMessage, showMessage } from "../functions/error-log.js"
import { save } from "../functions/save.js"
import { getCookie } from "../functions/get-cookie.js"

// File uploads are handled by NodeJS api using express
// Since images itself are only visible on the website,
// getting them from asp.net api is unnecessary

export const editAvatar = async (data, user_object) => {
    // Get avatar bg element
    const avatar = document.getElementById("avatar-bg")

    // Set as users background if exists 
    if(data.avatarUrl) {
        avatar.style.backgroundImage = `url("${data.avatarUrl}")`
    }

    // Get avatar upload form element
    const avatar_upload = document.getElementById("avatar")
    // Watch input for change (file select)
    avatar_upload.addEventListener("change", async (event) => {
        // Get file from form
        const file = event.target.files[0]
        if(!file) return

        // Append file to FormData form which will be sent to API
        const form = new FormData();
        form.append("file", file)

        const error_log_text = document.getElementById("error-log-text")
        showMessage("info", "Avatar upload started")

        const config = {
            headers: {
                "Authorization": `Bearer ${getCookie("token")}`,
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: function(progressEvent) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                error_log_text.innerText = `Upload progress: ${percentCompleted}%`;
            }
        };

        axios.post("/api/upload/avatar", form, config).then((res) => {
            hideMessage(0)

            setTimeout(() => {
                showMessage("success", "Upload successful, saving...")
            }, 400)

            user_object.avatarUrl = res.data.url
            // Save is automatic every time upload is successful
            return setTimeout(async () => await save(user_object), 800)

        }).catch(error => {
            hideMessage(0)
            console.log(error)

            setTimeout(() => {
                showMessage("error", "Error occurred while uploading your avatar, try again...")
                hideMessage(5000)
            }, 400)
        })
    })
}