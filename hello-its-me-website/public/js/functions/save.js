import { apiUrl } from "./secured-request.js";
import { getCookie } from "./get-cookie.js";

export async function save(object) {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getCookie("token")}`
        },
        body: JSON.stringify(object)
    };

    const res = await fetch(`${apiUrl}/api/user/`, requestOptions)

    if(res.ok && res.status === 204) {
        location.reload();
    }
}