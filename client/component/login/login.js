import { login } from "../../javascript/module.js"

document.getElementById("login").innerHTML = `
    <div class="imageDiv">
        <img src="./asset/court.png" />
    </div>
    <div class="formDiv">
        <h1>Sign In</h1>
        <div>
            <p>Username</p>
            <input id="loginUsernameInput" type="text" spellcheck="false" />
        </div>
        <div>
            <p>Password</p>
            <input id="loginPasswordInput" type="password" />
        </div>
        <button class="submitButton" id="loginSubmitButton">Login</button>
        <label id="loginStatusLabel"></label>
    </div>
`

document.getElementById("loginSubmitButton").addEventListener("click", async () => {

    const name = document.getElementById("loginUsernameInput").value
    const password = document.getElementById("loginPasswordInput").value

    const statusLabel = document.getElementById("loginStatusLabel")
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