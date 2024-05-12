import { securedReq, apiUrl } from "../functions/secured-request.js"

export const getUserByToken = async () => {
    const res = await securedReq(`${apiUrl}/api/user`, "GET")
    if (res) {
        const data = await res.json()
        return data
    }
}