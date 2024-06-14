import { insertUser } from "../../javascript/module.js"

document.getElementById("register").innerHTML = `
    <div class="imageDiv">
        <img src="./asset/login_register/court.png" />
    </div>
    <div class="formDiv">
        <h1>Sign Up</h1>
        <div>
            <p>Username</p>
            <input id="registerUsernameInput" type="text" spellcheck="false" />
        </div>
        <div>
            <p>Password</p>
            <input id="registerPasswordInput" type="password" />
        </div>
        <div>
            <p>Confirm Password</p>
            <input id="confirmPasswordInput" type="password" />
        </div>
        <div>
            <p>Role</p>
            <select id="roleDdl">
                <option value="" hidden></option>
                <option value="renter">Renter</option>
                <option value="owner">Owner</option>
            </select>
        </div>
        <button class="submitButton" id="registerSubmitButton">Register</button>
        <label id="registerStatusLabel"></label>
        <p>Already have an account? <label id="switchToLoginButton">Login Here</label></p>
    </div>
`

function validatePassword(password) {
    const minLength = /.{8,}/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    const hasWord = /[a-zA-Z]+/;
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /[0-9]/;

    if (minLength.test(password) && 
        hasSymbol.test(password) && 
        hasWord.test(password) && 
        hasUpperCase.test(password) && 
        hasNumber.test(password)) {
        return false
    }

    return true
}

document.getElementById("registerSubmitButton").addEventListener("click", async () => {

    const name = document.getElementById("registerUsernameInput").value
    const password = document.getElementById("registerPasswordInput").value
    const confirmPassword = document.getElementById("confirmPasswordInput").value
    const role = document.getElementById('roleDdl').value
    
    const statusLabel = document.getElementById("registerStatusLabel")

    if(name == "") {
        statusLabel.innerHTML = "Name must be filled"
    } else if(password == "") {
        statusLabel.innerHTML = "Password must be filled"
    } else if(confirmPassword == "") {
        statusLabel.innerHTML = "Confirm Password must be filled"
    } else if (role == "") {
        console.log(role)
        statusLabel.innerHTML = "Role must be choosed"
    } else if (name.length < 5) {
        console.log(2)
        statusLabel.innerHTML = "Name must be atleast 5 character"
    } else if (validatePassword(password)) {
        statusLabel.innerHTML = "Password must be atleast 8 character, 1 symbol, 1 number, and 1 upper case"
    } else if (password != confirmPassword) {
        statusLabel.innerHTML = "Password and Confirm Password must match"
    } else {

        statusLabel.innerHTML = ""
        
        const res = await insertUser(name, password, role)
        console.log(res)
        if(res.message == "Username already taken") {
            statusLabel.innerHTML = "Uda ada username yang sama"
        }
        if (res.message == "Register Success") {
            // window.location.href = "login.html"
            
            document.getElementById("register").style.display = 'none'
            document.getElementById("login").style.display = 'flex'
        }
    }

})

document.getElementById('switchToLoginButton').addEventListener('click', () => {
    document.getElementById("register").style.display = 'none'
    document.getElementById("login").style.display = 'flex'
    document.getElementById('loginUsernameInput').focus()
})