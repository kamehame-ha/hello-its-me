export const userPicture = async (data) => {
    const picture = document.getElementById("picture-bg")
    if(data.pictureUrl) {
        picture.style.backgroundImage = `url("${data.pictureUrl}")`
    }
}