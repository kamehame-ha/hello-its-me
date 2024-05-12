export const userAvatar = async (data) => {
    const avatar = document.getElementById("avatar-bg")
    if(data.avatarUrl) {
        avatar.style.backgroundImage = `url("${data.avatarUrl}")`
    }
}