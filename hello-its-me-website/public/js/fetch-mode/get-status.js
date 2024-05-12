export const userStatus = async (data) => {
    const status = document.getElementById("status")
    status.innerText = data.status
}