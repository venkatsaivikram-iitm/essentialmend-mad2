function showInfoMsg(msg, type, opts = {}) {
    if (type === "failure") type = "danger";

    const msgElement = document.createElement("div");
    msgElement.classList.add("position-fixed", "ultra-z-index", "top-0", "start-50", "translate-middle-x", "alert", `alert-${type}`, "fade-in");

    msgElement.textContent = msg;

    document.body.appendChild(msgElement);

    setTimeout(() => {
        setTimeout(() => {
            document.body.removeChild(msgElement);
            if (opts.reloadOnTimeout) {
                window.location.reload();
            }
        }, 500); // Duration of fade-out animation
    }, 3000);
    if (opts.forceReload) {
        window.location.reload();
    }
}

function redirect(href, timeout) {
    if (!href) return;

    setTimeout(() => {
        window.location.href = href;
    }, timeout || 0);
}

export { showInfoMsg, redirect };