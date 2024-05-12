import { getCookie } from "../functions/get-cookie.js"
import { setCookie } from "../functions/set-cookie.js"
import { securedReq, apiUrl } from "../functions/secured-request.js"

export const sessionCheck = async () => {
    const navList = document.getElementById("nav-list")
    const mobileNavList = document.getElementById("mobile-nav-list")
    const userNavList = document.getElementById("user-nav-list")

    if (getCookie("token")) {
        const res = await securedReq(`${apiUrl}/api/auth/jwt`, 'GET')
        const data = await res.json()

        if (data.user) {
            setCookie("token", data.accessToken)

            navList.style.display = 'none'
            userNavList.style.display = 'flex'
            mobileNavList.innerHTML = ''

            const user = document.getElementById('user')
            const edit = document.getElementById('edit')
            const logout = document.getElementById('logout')

            const mGithub = mobileNavList.appendChild(document.createElement('li'))
            const mLogout = mobileNavList.appendChild(document.createElement('li'))
            const mUsername = mobileNavList.appendChild(document.createElement('li'))


            mGithub.classList.add('nav-text-normal')
            mGithub.innerHTML = `<a href="https://github.com/kamehame-ha" target="_blank">Github</a>`

            edit.href = `/user/${data.user.username}/edit`

            // Logout
            logout.addEventListener('click', () => {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                location.href = "/"
            })

            // Logout mobile
            mLogout.classList.add('nav-text-normal')
            mLogout.innerHTML = `Logout`
            mLogout.addEventListener('click', () => {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                location.href = "/"
            })

            user.href = `/user/${data.user.username}`
            user.innerText = data.user.nickname.length > 1 ? data.user.nickname : data.user.username

            mUsername.classList.add('nav-text-bold')
            mUsername.innerHTML = `<a href="/user/${data.user.username}">${data.user.nickname.length > 1 ? data.user.nickname : data.user.username}</a>`

            if(location.href.endsWith("/") && !location.href.includes("user")) {
                const login_link = document.getElementById('login-link')
                login_link.href = `/user/${data.user.username}`
                login_link.innerText = "Go to your profile"
            }
        }
    }
}