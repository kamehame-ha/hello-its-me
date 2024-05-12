import { getCookie } from "./get-cookie.js"

export async function securedReq(url, method, body) {
    const requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(body) ?? null
    }

    const res = await fetch(url, requestOptions)
    
    return res
}

export const apiUrl = "https://its-me-api.kame.pro"