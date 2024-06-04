import { login } from "./module.js"

window.onload = () => {

    if(localStorage.getItem("user") != null) {
        window.location.href = "./index.html"
    }

}

document.getElementById("loginButton").addEventListener("click", async () => {

    const name = document.getElementById("usernameInput").value
    const password = document.getElementById("passwordInput").value

    const statusLabel = document.getElementById("statusLabel")
    if(name.length < 1) {
        statusLabel.innerHTML = "Name must be filled"
    } else if(password.length < 1) {
        statusLabel.innerHTML = "Password must be filled"
    } else {
        const res = await login(name, password)
        if(res.message == "Login Success") {
            localStorage.setItem("user", res.user.userId)
            window.location.href = "index.html"
        } else {
            statusLabel.innerHTML = res.message
        }
    }

})