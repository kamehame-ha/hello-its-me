import { securedReq, apiUrl } from "../functions/secured-request.js"

export const getUser = async () => {
    console.log(location.href.split("/")[4])
    const res = await securedReq(`${apiUrl}/api/user/${location.href.split("/")[4]}`, 'GET')
    if (res) {
        const data = await res.json()
        return data
    }
}