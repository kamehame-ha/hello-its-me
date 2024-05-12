import { hideMessage, showMessage } from "../functions/error-log.js"
import { save } from "../functions/save.js"
import { getCookie } from "../functions/get-cookie.js"

// File uploads are handled by NodeJS api using express
// Since images itself are only visible on the website,
// getting them from asp.net api is unnecessary


export const editPicture = async (data, user_object) => {
    // Get picture bg element
    const picture = document.getElementById("picture-bg")

    // Set as users background if exists
    if(data.pictureUrl) {
        picture.style.backgroundImage = `url("${data.pictureUrl}")`
    }

    // Get picture upload form element
    const picture_upload = document.getElementById("picture")

    picture_upload.addEventListener("change", async (event) => {
        // Get file from form
        const file = event.target.files[0]
        if(!file) return

        // Append file to FormData form which will be sent to API
        const form = new FormData();
        form.append("file", file)

        const error_log_text = document.getElementById("error-log-text")
        showMessage("info", "Picture upload started")

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

        axios.post("/api/upload/picture", form, config).then((res) => {
            hideMessage(0)

            setTimeout(() => {
                showMessage("success", "Upload successful, saving...")
            }, 400)

            user_object.pictureUrl = res.data.url
            // Save is automatic every time upload is successful
            return setTimeout(async () => await save(user_object), 800)

        }).catch(error => {
            hideMessage(0)
            console.log(error)

            setTimeout(() => {
                showMessage("error", "Error occurred while uploading your picture, try again...")
                hideMessage(5000)
            }, 400)
        })
    })
}