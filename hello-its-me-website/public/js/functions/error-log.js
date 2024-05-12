export function showMessage(type, text) {
    const error_log = document.getElementById("error-log")
    const error_log_box = document.getElementById("error-log-box")
    const error_log_icon = document.getElementById("error-log-icon")
    const error_log_text = document.getElementById("error-log-text")
    const icon_dir = "/img/icons/status/"

    const colors = {
        error: "#ef4444",
        info: "#3b82f6",
        success: "#22c55e"
    }

    error_log_box.style.background = colors[Object.keys(colors).find(x => x === type)]
    error_log_text.innerText = text
    error_log_icon.src = `${icon_dir}/${type}.svg`
    error_log.classList.replace("error-log-inactive", "error-log-active")
}

export function hideMessage(time) {
    const error_log = document.getElementById("error-log")

    if(time > 0) {
        setTimeout(() => {
            error_log.classList.replace("error-log-active", "error-log-inactive")
        }, time)
    } else {
        error_log.classList.replace("error-log-active", "error-log-inactive")
    }
}