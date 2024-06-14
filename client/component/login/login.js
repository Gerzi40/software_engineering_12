import { login } from "../../javascript/module.js"

document.getElementById("login").innerHTML = `
    <div class="imageDiv">
        <img src="./asset/login_register/court.png" />
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
        <p>Dont have an account? <label id="switchToRegisterButton">Register Here</label></p>
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
            localStorage.setItem("user-role", res.user.userRole)

            // const href = window.location.href
            // const indexOfHtml = href.indexOf('.html')
            // const page = href.slice(29, indexOfHtml)

            // if(page == 'index' || page == 'court' || page == 'court-detail' || page == 'booking' || page == 'about' || page == 'my-account') {
            //     localStorage.setItem('user-role', 'renter')
            // } else if(page == 'insert-court' || page == 'manual-booking' || page == 'my-court' || page == 'update-court') {
            //     localStorage.setItem('user-role', 'owner')
            // }

            window.location.reload()

        } else {
            statusLabel.innerHTML = res.message
        }
    }

})

document.getElementById('switchToRegisterButton').addEventListener('click', () => {
    document.getElementById("register").style.display = 'flex'
    document.getElementById("login").style.display = 'none'
    document.getElementById('registerUsernameInput').focus()
})