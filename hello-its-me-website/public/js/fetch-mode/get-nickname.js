export const userNickname = async (data) => {
    const nickname = document.getElementById("nickname")
    nickname.innerText = data.nickname ?? data.username
}