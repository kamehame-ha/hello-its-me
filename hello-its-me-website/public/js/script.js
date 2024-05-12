import { setCookie } from "./functions/set-cookie.js"
import { apiUrl, securedReq } from "./functions/secured-request.js"
import { sessionCheck } from "./session/session-script.js"
import { getUser } from "./user/get-user.js"
import { userColor } from "./fetch-mode/get-color.js"
import { userNickname } from "./fetch-mode/get-nickname.js"
import { userStatus } from "./fetch-mode/get-status.js"
import { userBio } from "./fetch-mode/get-bio.js"
import { userSocials } from "./fetch-mode/get-socials.js"
import { userAvatar } from "./fetch-mode/get-avatar.js"
import { userPicture } from "./fetch-mode/get-picture.js"
import { randomColors } from "./functions/random-colors.js"
import { getUserByToken } from "./user/get-user-by-token.js"
import { editNickname } from "./edit-mode/edit-nickname.js"
import { editStatus } from "./edit-mode/edit-status.js"
import { editBio } from "./edit-mode/edit-bio.js"
import { editSocials } from "./edit-mode/edit-socials.js"
import { editAvatar } from "./edit-mode/edit-avatar.js"
import { editPicture } from "./edit-mode/edit-picture.js"
import { editColor } from "./edit-mode/edit-color.js"
import { hideMessage, showMessage } from "./functions/error-log.js"

// Random colors
const check = document.getElementById('site')

if(!check) {
    randomColors()
}

// Session check & navbar update
await sessionCheck()

// Login handling
const form = document.getElementById("form")
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        // Perform login request to API
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            })
        }

        const res = await fetch(`${apiUrl}/api/auth/login`, requestOptions)

        // Convert data from json to js object
        const data = await res.json()

        // Set token from response to a cookie
        if(data.accessToken) {
            setCookie("token", data.accessToken)
            location.href = "/"
        }

        if(res.status === 400) {
            showMessage("error", "Username or password are invalid")
            hideMessage(5000)
        }
    })
}

// Get profile card element (used both in fetch & edit mode)
const card = document.getElementById("card")

const href = location.href

// User page
if(href.includes("user") && !href.includes('edit') && !href.includes('account')) {
    const data = await getUser()
    if(data) {
        // Set page title to user name or nickname if exists
        document.title = `Hello its me - ${data.nickname ? data.nickname : data.username}`

        // Run each of the separated fetch functions
        userColor(data)
        userNickname(data)
        userStatus(data)
        userBio(data)
        userSocials(data)
        userAvatar(data)
        userPicture(data)

        // Show user card after data fetch
        card.style.display = "block"
    }
}

// User edit page
if(href.includes("user") && href.includes('edit')) {
    // Get mobile block element
    const mobile_block = document.getElementById("mobile-block")
    // By default mobile block is hidden
    mobile_block.style.display = "none"

    // Icon edit display off
    // Not sure why, i need to check what for
    const icon_edit = document.getElementById("icon-edit")
    icon_edit.style.display = "none"

    // User fetch
    const data = await getUserByToken()
    if(data) {
        // Set page title to user name or nickname if exists
        document.title = `Hello its me - ${data.nickname ? data.nickname : data.username}`

        // Main instance of user_object
        // Syntax due to API needs
        const user_object = {
            nickname: null,
            status: null,
            avatarUrl: null,
            pictureUrl: null,
            socialAccounts: data.socialAccounts ?? [],
            bio: null,
            colorScheme: null
        }

        // Run basic color fetch
        userColor(data)

        // Run each of edit mode functions

        editNickname(data, user_object)
        editStatus(data, user_object)
        editBio(data, user_object)
        editSocials(data, user_object)
        editAvatar(data, user_object)
        editPicture(data, user_object)
        editColor(data, user_object)
    }
    // Mobile block event
    // Blocks card editing for mobile devices (less than 640px screen width)
    window.addEventListener('resize', () => {
        if(window.innerWidth < 640) {
            card.style.display = "none"
            mobile_block.style.display = "flex"
        } else {
            card.style.display = "block"
            mobile_block.style.display = "none"
        }
    })

    // Mobile block if user enters using mobile device (less than 640px screen width)
    if(window.innerWidth < 640) {
        card.style.display = "none"
        mobile_block.style.display = "flex"
    } else {
        card.style.display = "block"
    }
}

if(href.includes("user") && href.includes('account')) {
    const data = await getUserByToken()
    userColor(data)

    const password_bt = document.getElementById("change-password")
    const delete_bt = document.getElementById("delete-account")
    const password_form = document.getElementById("password-form")

    const header = document.getElementById("header")
    const text = document.getElementById("text")

    delete_bt.addEventListener('click', async () => {
        // This operation will permanently delete your account
        header.innerText = "Are you sure?"
        text.style.display = "flex"
        text.innerText = "This operation will permanently delete your account"
        password_bt.innerText = "Yes"
        delete_bt.innerText = "No"

        password_bt.addEventListener('click', async () => {
            const res = await securedReq(`${apiUrl}/api/auth/manage-account`, 'DELETE')
            if(res.ok) {
                location.href = "/"
            } else {
                showMessage('error', 'Something gone wrong, try again...')
                hideMessage(5000)
            }
        })

        delete_bt.addEventListener('click', () => location.reload())

    })

    password_bt.addEventListener('click', () => {
        delete_bt.style.display = "none"
        password_bt.style.display = "none"
        password_form.style.display = "flex"
    })

    document.getElementById("back").addEventListener('click', () => location.reload())

    password_form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const old_password = document.getElementById('new')
        const new_password = document.getElementById('new-repeat')

        const res = await securedReq(`${apiUrl}/api/auth/manage-account`, 'PATCH', {
            username: data.username,
            oldPassword: old_password.value,
            newPassword: new_password.value
        })
        if(res.ok) {
            showMessage('success', 'Password changed!')
            hideMessage(5000)
            setTimeout(() => {
                location.reload()
            }, 5000)
        } else {
            showMessage('error', (await res.json()).message)
            hideMessage(5000)
        }
    })
}